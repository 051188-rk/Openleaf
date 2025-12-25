import subprocess
import os
import tempfile
import shutil
import base64
from pathlib import Path
from typing import Optional, Tuple

class PDFService:
    """Service for compiling LaTeX to PDF"""
    
    def __init__(self):
        self.temp_dir = Path("temp_latex")
        self.temp_dir.mkdir(exist_ok=True)
        self.pdflatex_path = self._find_pdflatex()
    
    def _find_pdflatex(self) -> Optional[str]:
        """Find pdflatex executable in common installation paths"""
        # Try common MiKTeX installation paths
        possible_paths = [
            # User-specific installation
            Path(os.path.expanduser("~")) / "AppData" / "Local" / "Programs" / "MiKTeX" / "miktex" / "bin" / "x64" / "pdflatex.exe",
            # System-wide installation
            Path("C:/Program Files/MiKTeX/miktex/bin/x64/pdflatex.exe"),
            Path("C:/miktex/miktex/bin/x64/pdflatex.exe"),
            # Check if it's in PATH
            "pdflatex"
        ]
        
        for path in possible_paths:
            if path == "pdflatex":
                # Check if it's in PATH
                try:
                    result = subprocess.run(
                        ['pdflatex', '--version'],
                        capture_output=True,
                        timeout=5
                    )
                    if result.returncode == 0:
                        return "pdflatex"
                except:
                    continue
            else:
                if Path(path).exists():
                    return str(path)
        
        return None

    
    def compile_latex_to_pdf(self, latex_content: str, output_name: str = "resume") -> Tuple[bool, Optional[str], Optional[str]]:
        """
        Compile LaTeX content to PDF.
        
        Returns:
            Tuple of (success: bool, pdf_path: Optional[str], error: Optional[str])
        """
        # Create a unique temporary directory for this compilation
        temp_compile_dir = tempfile.mkdtemp(dir=self.temp_dir)
        
        try:
            # Write LaTeX content to file
            tex_file = os.path.join(temp_compile_dir, f"{output_name}.tex")
            with open(tex_file, 'w', encoding='utf-8') as f:
                f.write(latex_content)
            
            # Try to compile with pdflatex
            try:
                if not self.pdflatex_path:
                    return False, None, "pdflatex not found. Please install MiKTeX or add it to your PATH."
                
                # Run pdflatex twice for proper formatting (references, etc.)
                for _ in range(2):
                    result = subprocess.run(
                        [self.pdflatex_path, '-interaction=nonstopmode', '-halt-on-error', f'{output_name}.tex'],
                        cwd=temp_compile_dir,
                        capture_output=True,
                        text=True,
                        timeout=30
                    )
                
                pdf_file = os.path.join(temp_compile_dir, f"{output_name}.pdf")
                
                if os.path.exists(pdf_file):
                    # Move PDF to main temp directory
                    final_pdf_path = os.path.join(self.temp_dir, f"{output_name}_{os.path.basename(temp_compile_dir)}.pdf")
                    shutil.copy(pdf_file, final_pdf_path)
                    return True, final_pdf_path, None
                else:
                    error_msg = result.stderr if result.stderr else "PDF compilation failed"
                    return False, None, error_msg
                    
            except FileNotFoundError:
                return False, None, "pdflatex not found. Please install a LaTeX distribution."
            except subprocess.TimeoutExpired:
                return False, None, "Compilation timeout - LaTeX code may have errors"
            except Exception as e:
                return False, None, f"Compilation error: {str(e)}"
                
        finally:
            # Clean up temporary compilation directory
            try:
                shutil.rmtree(temp_compile_dir)
            except:
                pass
    
    def pdf_to_base64(self, pdf_path: str) -> Optional[str]:
        """Convert PDF file to base64 data URL"""
        try:
            with open(pdf_path, 'rb') as f:
                pdf_bytes = f.read()
                base64_encoded = base64.b64encode(pdf_bytes).decode('utf-8')
                return f"data:application/pdf;base64,{base64_encoded}"
        except Exception as e:
            print(f"Error encoding PDF to base64: {e}")
            return None
    
    def compile_and_encode(self, latex_content: str) -> Tuple[bool, Optional[str], Optional[str]]:
        """
        Compile LaTeX and return base64-encoded PDF.
        
        Returns:
            Tuple of (success: bool, base64_pdf: Optional[str], error: Optional[str])
        """
        success, pdf_path, error = self.compile_latex_to_pdf(latex_content)
        
        if not success:
            return False, None, error
        
        base64_pdf = self.pdf_to_base64(pdf_path)
        
        if base64_pdf:
            return True, base64_pdf, None
        else:
            return False, None, "Failed to encode PDF"
    
    def cleanup_old_files(self, max_age_hours: int = 24):
        """Remove PDF files older than max_age_hours"""
        import time
        current_time = time.time()
        
        for file_path in self.temp_dir.glob("*.pdf"):
            if os.path.isfile(file_path):
                file_age = current_time - os.path.getmtime(file_path)
                if file_age > (max_age_hours * 3600):
                    try:
                        os.remove(file_path)
                    except:
                        pass

# Singleton instance
pdf_service = PDFService()
