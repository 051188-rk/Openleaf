from pydantic import BaseModel
from typing import List, Optional

class ResumeInput(BaseModel):
    role: str
    skills: List[str]
    experience: str
    template_id: str = "modern"

class ResumeSectionInput(BaseModel):
    section_name: str
    current_content: str
    instruction: str

class GeneratedResume(BaseModel):
    latex_content: str
    markdown_content: Optional[str] = None

class ChatMessage(BaseModel):
    message: str
    latex_content: str

class CompilePDFRequest(BaseModel):
    latex_content: str

class FileTreeNode(BaseModel):
    name: str
    type: str  # 'file' or 'folder'
    children: Optional[List['FileTreeNode']] = None

# Authentication schemas
class UserSignup(BaseModel):
    email: str
    password: str
    name: str

class UserLogin(BaseModel):
    email: str
    password: str

class UserResponse(BaseModel):
    id: int
    email: str
    name: str
    createdAt: str

class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: UserResponse


