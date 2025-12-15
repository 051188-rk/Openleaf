import os
from langchain_google_genai import ChatGoogleGenerativeAI
from langchain.prompts import PromptTemplate
from langchain.output_parsers import PydanticOutputParser
from pydantic import BaseModel, Field
from dotenv import load_dotenv

load_dotenv()

class ResumeContent(BaseModel):
    latex_code: str = Field(description="The complete LaTeX code for the resume")

def get_llm():
    api_key = os.getenv("GOOGLE_API_KEY")
    if not api_key:
        raise ValueError("GOOGLE_API_KEY not found in environment variables")
    return ChatGoogleGenerativeAI(model="gemini-2.5-flash", google_api_key=api_key, temperature=0.7)

def generate_resume_content(role: str, skills: list, experience: str, template_latex: str) -> str:
    llm = get_llm()
    parser = PydanticOutputParser(pydantic_object=ResumeContent)
    
    prompt = PromptTemplate(
        template="""
        You are an expert resume writer and LaTeX pro.
        Your task is to take the provided user information and fill into the provided LaTeX template to create a ATS-friendly resume.
        
        USER INFORMATION:
        Role: {role}
        Skills: {skills}
        Experience: {experience}
        
        LATEX TEMPLATE:
        {template_latex}
        
        INSTRUCTIONS:
        1. Keep the structure of the template exactly as is.
        2. Replace the placeholder content with the user's information, optimized for the role.
        3. Use professional, formal language.
        4. Ensure all LaTeX syntax is valid.
        5. Return ONLY the full valid LaTeX code.
        
        {format_instructions}
        """,
        input_variables=["role", "skills", "experience", "template_latex"],
        partial_variables={"format_instructions": parser.get_format_instructions()}
    )
    
    chain = prompt | llm | parser
    
    try:
        result = chain.invoke({
            "role": role,
            "skills": ", ".join(skills),
            "experience": experience,
            "template_latex": template_latex
        })
        return result.latex_code
    except Exception as e:
        # Fallback if parsing fails (sometimes Gemini might not match strict JSON perfectly)
        # For robustness in a demo, we might want to return raw text or retry.
        # Here we re-raise for now to catch in the UI.
        print(f"Error generating resume: {e}")
        raise e

def edit_resume_section(current_latex: str, instruction: str) -> str:
    llm = get_llm()
    parser = PydanticOutputParser(pydantic_object=ResumeContent)
    
    prompt = PromptTemplate(
        template="""
        You are an expert resume editor.
        Your task is to modify the provided LaTeX resume code based on the user's instruction.
        
        CURRENT LATEX:
        {current_latex}
        
        INSTRUCTION:
        {instruction}
        
        INSTRUCTIONS:
        1. Modify only the parts relevant to the instruction.
        2. Ensure the resulting LaTeX is valid and capable of compiling.
        3. Do not change the overall template structure unless asked.
        
        {format_instructions}
        """,
        input_variables=["current_latex", "instruction"],
        partial_variables={"format_instructions": parser.get_format_instructions()}
    )
    
    chain = prompt | llm | parser
    result = chain.invoke({"current_latex": current_latex, "instruction": instruction})
    return result.latex_code
