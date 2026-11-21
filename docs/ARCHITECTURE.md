# Architecture

## Design principles

1. Keep UI, API, document processing, LLMs, and music generation independently replaceable.
2. Long-running AI/audio work is asynchronous and represented by durable jobs.
3. Keep provider credentials on the server.
4. Tie every generated artifact to its source document and selected concepts.
5. Treat generated lyrics as untrusted until checked against source material.

## Request flow

1. The browser uploads a PDF to FastAPI.
2. FastAPI validates type, size, and parseability, then stores it outside the public directory.
3. PyMuPDF extracts text. A future OCR worker handles scanned pages.
4. The analysis service splits text into bounded chunks and identifies chapter/topic structure.
5. The LLM returns schema-validated lyrics with section and concept references.
6. A verification pass checks concept coverage and unsupported claims.
7. The user reviews/edits lyrics.
8. A music-provider adapter creates vocal audio asynchronously.
9. The worker validates provider output, stores audio privately, and marks the job complete.
10. The browser polls job status and streams a short-lived signed audio URL.

## Core boundaries

- Frontend: Next.js App Router, TypeScript, Tailwind CSS.
- API: FastAPI, Pydantic.
- Document parser: PyMuPDF. OCR is an optional next-stage service.
- LLM: server-side adapter configured via environment.
- Music: provider abstraction; no provider is assumed available until credentials and API contract are verified.
- Jobs: Redis/Celery foundation.
- Persistence: PostgreSQL; SQLAlchemy models/migrations are next implementation milestone.
- Media: private object storage in production; local storage for development only.

## Security requirements before public launch

- Add authentication and enforce user ownership on every document, job, and artifact endpoint.
- Use private object storage and expiring signed URLs.
- Enforce upload size, page count, parsing timeout, and job-cost limits.
- Do not render uploaded HTML or execute any document content.
- Add malware scanning for uploaded files where available.
- Keep secrets out of the frontend bundle and logs.
- Implement rate limiting, idempotency, deletion and retention policies.
- Verify music provider licensing, user-input rights, region availability and output terms.
