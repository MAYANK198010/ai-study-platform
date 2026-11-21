from pathlib import Path
import pymupdf as fitz

def extract_pdf_text(path: Path) -> dict:
    pages: list[dict] = []
    text_parts: list[str] = []
    with fitz.open(path) as document:
        if document.is_encrypted:
            raise ValueError("Password-protected PDFs are not supported yet")
        if document.page_count > 300:
            raise ValueError("PDF exceeds the 300-page processing limit")
        for index, page in enumerate(document):
            text = page.get_text("text", sort=True).strip()
            pages.append({"page": index + 1, "text": text})
            if text:
                text_parts.append(f"[Page {index + 1}]\\n{text}")
    combined = "\\n\\n".join(text_parts)
    if len(combined.strip()) < 30:
        raise ValueError("No readable text found. Scanned-PDF OCR is not enabled yet.")
    return {"pages": len(pages), "text": combined, "page_text": pages}
