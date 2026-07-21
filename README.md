# Industrial Knowledge Intelligence Platform

Industrial Knowledge Intelligence Platform is a production-style AI-powered RAG application for industrial document management. It combines a FastAPI backend, a React + Vite frontend, and a retrieval layer for indexed industrial manuals, SOPs, and maintenance documents.

## Features

- JWT-based authentication with worker and owner roles
- Owner upload workflow for PDF ingestion
- Worker-facing assistant with citations, confidence, and source cards
- Dashboard metrics for uploaded PDFs, chunks, equipment, and recent questions
- Clean separation between frontend and backend services

## Backend

- Python 3.11+
- FastAPI
- PyMuPDF for PDF text extraction

## Frontend

- React 18
- Vite
- Tailwind CSS
- React Router

## Quick start

### Backend

```bash
cd backend
python -m venv .venv
source .venv/bin/activate  # Windows: .venv\Scripts\activate
pip install -r requirements.txt
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```

## Default credentials

- Worker: worker / worker123
- Owner: owner / owner123

## Environment variables

Set these in the backend environment as needed:

- GROQ_API_KEY
- GROQ_MODEL
- JWT_SECRET
