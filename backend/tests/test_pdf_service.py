import fitz
import pytest
from app.services.pdf_service import extract_pdf_text

def test_extracts_text_and_page_count(tmp_path):
    path = tmp_path / "sample.pdf"
    doc = fitz.open()
    page = doc.new_page()
    page.insert_text((72, 72), "Database Management System fundamentals")
    doc.save(path)
    doc.close()

    result = extract_pdf_text(path)
    assert result["pages"] == 1
    assert "Database Management System" in result["text"]
    assert result["page_text"][0]["page"] == 1

def test_rejects_pdf_without_extractable_text(tmp_path):
    path = tmp_path / "image_only.pdf"
    doc = fitz.open()
    doc.new_page()
    doc.save(path)
    doc.close()

    with pytest.raises(ValueError, match="No readable text"):
        extract_pdf_text(path)
