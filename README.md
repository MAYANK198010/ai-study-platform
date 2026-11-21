# AI Study Platform

A modular AI learning platform that turns course PDFs into accurate, multilingual study material and vocal study songs.

## Current implementation

- Next.js App Router + TypeScript frontend
- FastAPI backend
- PDF text extraction with PyMuPDF
- Chapter/topic analysis and structured song-lyric generation
- OpenAI-compatible LLM adapter (configured server-side)
- Replaceable music-provider adapter; provider API integration is intentionally isolated
- Redis/Celery background-job foundation
- PostgreSQL schema foundation
- Docker Compose for local infrastructure

> Vocal music generation is provider-gated. Configure a supported music API and verify its current model, region, lyrics, duration, and commercial-use terms before enabling production generation. The app does not claim a music job succeeded unless the provider returns a usable audio asset.

## Repository layout

- `frontend/`: Next.js user interface
- `backend/`: FastAPI API and AI processing services
- `docs/`: architecture, API and development notes
- `infrastructure/`: local database and Redis

## Quick start

Requirements: Node.js 20+, Python 3.11+, Docker.

1. Copy `.env.example` to `.env` and add provider credentials.
2. Start local infrastructure:

   ```bash
   docker compose -f infrastructure/docker-compose.yml up -d
   ```

3. Start the API:

   ```bash
   cd backend
   python -m venv .venv
   # Windows: .venv\\Scripts\\activate
   # macOS/Linux: source .venv/bin/activate
   pip install -r requirements.txt
   uvicorn app.main:app --reload --port 8000
   ```

4. Start the frontend in another terminal:

   ```bash
   cd frontend
   npm install
   npm run dev
   ```

5. Open http://localhost:3000 and API docs at http://localhost:8000/docs.

## Environment

See `.env.example`. Never commit API keys, credentials, private PDFs, or generated user content.

## Safety and data handling

- Uploaded files are size/type checked and stored outside the public web root.
- API keys remain on the backend.
- Document and job endpoints are scaffolded for authenticated ownership checks; do not expose publicly until authentication and authorization are enabled.
- Validate provider output and source coverage before persisting a generated study song.
- Set a retention policy and provide deletion controls before production launch.

## Current status

This is an initial implementation scaffold, not a production-ready platform. Authentication, complete persistence, OCR, end-to-end music-provider integration, deployment, and comprehensive tests remain planned work. See [docs/IMPLEMENTATION_PLAN.md](docs/IMPLEMENTATION_PLAN.md).
