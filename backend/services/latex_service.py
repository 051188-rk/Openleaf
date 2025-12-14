import os
import subprocess
import uuid
from pathlib import Path

TEMP_DIR = Path("temp_latex")
TEMP_DIR.mkdir(exist_ok=True)

def compile_latex_to_pdf(latex_content: str) -> str:
    """
    Compiles LaTeX content to PDF and returns the path to the PDF file.
    Assumes pdflatex is installed and in the PATH.
    """
    session_id = str(uuid.uuid4())
    tex_file = TEMP_DIR / f"{session_id}.tex"
    pdf_file = TEMP_DIR / f"{session_id}.pdf"
    
    # Write latex content to file
    with open(tex_file, "w", encoding="utf-8") as f:
        f.write(latex_content)
        
    try:
        # Compile using pdflatex
        # We run it twice to ensure references are resolved if needed, but for speed once might be enough for simple resumes
        # Using interaction=nonstopmode to prevent hanging on errors
        process = subprocess.run(
            ["pdflatex", "-interaction=nonstopmode", "-output-directory", str(TEMP_DIR), str(tex_file)],
            stdout=subprocess.PIPE,
            stderr=subprocess.PIPE,
            timeout=10
        )
        
        if process.returncode != 0:
            error_msg = process.stdout.decode() if process.stdout else "Unknown error"
            print(f"LaTeX Compilation Failed:\n{error_msg}")
            # Identify if it's a missing command
            if "pdflatex: command not found" in error_msg or "is not recognized" in error_msg:
                 raise EnvironmentError("pdflatex not found. Please install a TeX distribution (e.g., MiKTeX, TeX Live).")
            # Return path anyway in case it partially worked or to handle failure upstream? 
            # Better to raise exception
            # For resilience (since user might not have latex), we could return None
            # But let's assume successful setup for now.
            
        if not pdf_file.exists():
             raise Exception("PDF file was not created. Check LaTeX syntax.")
             
        return str(pdf_file)
        
    except FileNotFoundError:
        raise EnvironmentError("pdflatex not found. Please install a TeX distribution.")
    except Exception as e:
        print(f"Error compiling LaTeX: {e}")
        raise e
