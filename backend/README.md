# Backend Setup

## Navigate to Backend Directory
```bash
cd apps/backend
```

## Install Dependencies
```bash
pip install -r requirements.txt
```

## Configure Environment
Create or edit `.env` file in `apps/backend/`:
```
GOOGLE_API_KEY=your_gemini_api_key_here
```

## Run Backend
```bash
python run.py
```

Backend will run on: **http://localhost:8000**  
API Docs: **http://localhost:8000/docs**

## Notes
- Make sure you have pdflatex installed (MiKTeX or TeX Live) for PDF generation
- The backend will auto-reload on code changes
