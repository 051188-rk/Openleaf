from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import uvicorn
import sys
from pathlib import Path

# Add parent directory to path to import from apps
sys.path.insert(0, str(Path(__file__).parent.parent.parent))

from apps.backend.main import app as backend_router

app = FastAPI(title="Res-Gen API")

# CORS middleware for frontend development
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:3000", "http://127.0.0.1:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Mount backend routes
app.include_router(backend_router)

@app.get("/")
def read_root():
    return {"message": "Res-Gen API is running", "docs": "/docs"}

if __name__ == "__main__":
    print("🚀 Starting Res-Gen Backend Server...")
    print("📍 API URL: http://localhost:8000")
    print("📖 API Docs: http://localhost:8000/docs")
    uvicorn.run("run:app", host="0.0.0.0", port=8000, reload=True)
