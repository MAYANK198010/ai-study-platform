from pathlib import Path
from uuid import uuid4
from fastapi import APIRouter, File, HTTPException, UploadFile
from app.services.pdf_service import extract_pdf_text
from app.services.lyrics_service import generate_lyrics
from app.schemas import LyricsRequest
from app.core.config import settings

router = APIRouter()

@router.post("/documents")
async def upload_document(file: UploadFile = File(...)):
    if file.content_type != "application/pdf" and not (file.filename or "").lower().endswith(".pdf"):
        raise HTTPException(status_code=415, detail="Only PDF files are supported")
    data = await file.read(settings.max_upload_bytes + 1)
    if len(data) > settings.max_upload_bytes:
        raise HTTPException(status_code=413, detail="PDF exceeds configured upload limit")
    if not data.startswith(b"%PDF-"):
        raise HTTPException(status_code=400, detail="File does not have a valid PDF header")
    settings.upload_dir.mkdir(parents=True, exist_ok=True)
    doc_id = str(uuid4())
    path = settings.upload_dir / f"{doc_id}.pdf"
    path.write_bytes(data)
    try:
        extracted = extract_pdf_text(path)
    except Exception as exc:
        path.unlink(missing_ok=True)
        raise HTTPException(status_code=422, detail=f"Could not parse PDF: {exc}") from exc
    return {"document_id": doc_id, "filename": file.filename, "pages": extracted["pages"], "text": extracted["text"][:100000], "truncated": len(extracted["text"]) > 100000}

@router.post("/songs/lyrics")
async def create_lyrics(request: LyricsRequest):
    try:
        return await generate_lyrics(request)
    except RuntimeError as exc:
        raise HTTPException(status_code=503, detail=str(exc)) from exc
