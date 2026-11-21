# Implementation plan

## Milestone 1 — Core vertical slice
- [x] Next.js app foundation
- [x] FastAPI app foundation
- [x] PDF text extraction endpoint
- [x] Structured chapter/topic analysis scaffold
- [x] Structured lyric-generation service
- [x] Music-provider interface and explicit mock mode
- [ ] Authentication and user authorization
- [ ] Persistent documents/jobs/artifacts
- [ ] Real music-provider integration and end-to-end audio test

## Milestone 2 — Reliable document processing
- Page-aware extraction and source citations
- Scanned PDF detection and OCR
- Table/formula preservation strategy
- Chunking and chapter-boundary evaluation
- Malware scanning and resource limits

## Milestone 3 — Study tools
- Summaries and revision notes
- Flashcards and MCQ generation
- Quiz attempts and learning progress
- Mind maps with source references

## Milestone 4 — Production readiness
- PostgreSQL migrations and backups
- S3-compatible private storage
- Celery workers and retries
- Rate limits, quota and cost accounting
- Observability, tracing and alerts
- CI, tests and deployment

## Acceptance criteria for vocal study songs
- Every selected concept is mapped to one or more lyric sections.
- Lyrics are editable before music generation.
- The provider returns a validated audio file and usage metadata.
- Hindi, English and Hinglish pronunciation are tested with technical vocabulary.
- Generation failures are surfaced; no fake or placeholder output is shown as completed.
- Users can delete uploaded documents and derived artifacts.
