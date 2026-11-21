import json
from openai import AsyncOpenAI
from app.core.config import settings
from app.schemas import LyricsRequest

SYSTEM_PROMPT = """You create educational lyrics from source material. Preserve factual meaning and technical terms. Never invent facts to force a rhyme. Make a memorable chorus and simple, pronounceable lines. Return JSON with title, language, sections (type, lyrics, source_concepts), and covered_concepts. Include source_concepts for traceability. Mark the result for human review; do not claim guaranteed memorization."""

async def generate_lyrics(request: LyricsRequest) -> dict:
    if not settings.openai_api_key:
        raise RuntimeError("OPENAI_API_KEY is not configured")
    client = AsyncOpenAI(api_key=settings.openai_api_key)
    response = await client.chat.completions.create(
        model=settings.openai_model,
        response_format={"type": "json_object"},
        messages=[
            {"role": "system", "content": SYSTEM_PROMPT},
            {"role": "user", "content": json.dumps({"title": request.title, "language": request.language, "genre": request.genre, "source_material": request.source_text}, ensure_ascii=False)},
        ],
        temperature=0.4,
    )
    content = response.choices[0].message.content
    if not content:
        raise RuntimeError("The language model returned an empty response")
    result = json.loads(content)
    result["review_required"] = True
    return result
