from fastapi import APIRouter, HTTPException, BackgroundTasks
from fastapi.responses import FileResponse, JSONResponse
from apps.backend.models.schemas import (
    ResumeInput, 
    ResumeSectionInput, 
    GeneratedResume,
    ChatMessage,
    CompilePDFRequest,
    FileTreeNode
)
from apps.backend.services.gemini_service import generate_resume_content, edit_resume_section
from apps.backend.services.latex_service import compile_latex_to_pdf, compile_latex_to_image
import os


app = APIRouter()

# Simple in-memory storage for demo purposes
# In production, use Redis or a database
user_sessions = {}

# Load templates
TEMPLATES = {}
TEMPLATE_DIR = os.path.join(os.path.dirname(__file__), "templates")
try:
    for filename in os.listdir(TEMPLATE_DIR):
        if filename.endswith(".tex"):
            name = filename.replace(".tex", "")
            with open(os.path.join(TEMPLATE_DIR, filename), "r", encoding="utf-8") as f:
                TEMPLATES[name] = f.read()
except FileNotFoundError:
    print("Templates directory not found. Please ensure 'templates' directory exists.")

@app.post("/generate", response_model=GeneratedResume)
async def generate_resume(data: ResumeInput):
    template_content = TEMPLATES.get(data.template_id)
    if not template_content:
        # Fallback to a default if ID not found, or error
        if TEMPLATES:
             template_content = list(TEMPLATES.values())[0]
        else:
            raise HTTPException(status_code=500, detail="No templates available")
            
    try:
        latex_code = generate_resume_content(
            role=data.role,
            skills=data.skills,
            experience=data.experience,
            template_latex=template_content
        )
        return GeneratedResume(latex_content=latex_code)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/preview")
async def preview_resume(data: GeneratedResume):
    try:
        pdf_path = compile_latex_to_pdf(data.latex_content)
        if not pdf_path or not os.path.exists(pdf_path):
             raise HTTPException(status_code=500, detail="PDF generation failed")
        
        # In a real app, we might return a URL to serve the file
        # Here we'll return the path and serve via a separate endpoint or 
        # just return the file directly if the client expects a blob.
        # Ideally, return a unique ID to fetch the PDF.
        filename = os.path.basename(pdf_path)
        return {"pdf_url": f"/api/download/{filename}"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/download/{filename}")
async def download_pdf(filename: str):
    # Security check: ensure filename is safe and exists in temp dir
    # This is a naive check; production needs better path traversal protection
    if ".." in filename or "/" in filename:
        raise HTTPException(status_code=400, detail="Invalid filename")
        
    temp_dir = "temp_latex" 
    file_path = os.path.join(temp_dir, filename)
    if not os.path.exists(file_path):
        raise HTTPException(status_code=404, detail="File not found")
        
    return FileResponse(file_path, media_type="application/pdf", filename="resume.pdf")

@app.post("/edit", response_model=GeneratedResume)
async def edit_resume(data: ResumeSectionInput):
    try:
        # data.current_content is the FULL latex content or a CHUNK?
        # The prompt in gemini_service expects 'current_latex'.
        # If the user sends a chunk, we might need to know WHERE to replace it.
        # For this "agent check-wise searching" requirement:
        # We'll assume the client sends the FULL latex and the instruction.
        # The LLM will identify the relevant part and change it.
        
        # If we wanted purely chunk-based:
        # 1. LLM identifies chunk to change
        # 2. LLM rewrites chunk
        # 3. Code replaces chunk
        # For simplicity and robustness with LLMs, sending context is better.
        
        new_latex = edit_resume_section(data.current_content, data.instruction)
        return GeneratedResume(latex_content=new_latex)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/compile-preview")
async def compile_preview(data: GeneratedResume):
    """
    Compiles LaTeX to a base64-encoded PNG image for real-time preview.
    Returns: {"image": "data:image/png;base64,..."}
    """
    try:
        image_data = compile_latex_to_image(data.latex_content)
        return {"image": image_data}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/templates")
async def get_templates():
    return [{"id": name, "name": name.title()} for name in TEMPLATES.keys()]

@app.post("/compile-pdf-base64")
async def compile_pdf_base64(data: CompilePDFRequest):
    """
    Compile LaTeX to PDF and return as base64 data URL for iframe embedding.
    Returns: {"success": bool, "pdf": "data:application/pdf;base64,...", "error": str}
    """
    from apps.backend.services.pdf_service import pdf_service
    
    try:
        success, base64_pdf, error = pdf_service.compile_and_encode(data.latex_content)
        
        if success:
            return {"success": True, "pdf": base64_pdf, "error": None}
        else:
            return {"success": False, "pdf": None, "error": error or "Unknown compilation error"}
    except Exception as e:
        return {"success": False, "pdf": None, "error": str(e)}

@app.post("/chat-edit")
async def chat_edit(data: ChatMessage):
    """
    Use AI to edit LaTeX based on user instruction.
    Returns: {"latex_content": str, "success": bool, "error": str}
    """
    try:
        from apps.backend.services.gemini_service import edit_resume_section
        
        new_latex = edit_resume_section(data.latex_content, data.message)
        return {"latex_content": new_latex, "success": True, "error": None}
    except Exception as e:
        return {"latex_content": data.latex_content, "success": False, "error": str(e)}

@app.get("/file-tree")
async def get_file_tree():
    """
    Return a mock file tree structure for the editor.
    """
    return {
        "name": "root",
        "type": "folder",
        "children": [
            {"name": "resume.tex", "type": "file"},
            {"name": "resume.cls", "type": "file"},
        ]
    }

