from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api.routes import router

app = FastAPI(title="AI Study Platform API", version="0.1.0")
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["GET", "POST", "PATCH", "DELETE"],
    allow_headers=["Authorization", "Content-Type", "Idempotency-Key"],
)
app.include_router(router, prefix="/api/v1")

@app.get("/health")
async def health() -> dict[str, str]:
    return {"status": "ok"}
