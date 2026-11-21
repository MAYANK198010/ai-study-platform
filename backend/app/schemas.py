from typing import Literal
from pydantic import BaseModel, Field

Language = Literal["english", "hindi", "hinglish"]
Genre = Literal["pop", "hip_hop", "lofi", "acoustic", "electronic"]

class LyricsRequest(BaseModel):
    source_text: str = Field(min_length=50, max_length=30000)
    title: str = Field(min_length=1, max_length=160)
    language: Language = "english"
    genre: Genre = "pop"

class LyricSection(BaseModel):
    type: Literal["intro", "verse", "chorus", "bridge", "outro"]
    lyrics: str
    source_concepts: list[str] = []

class LyricsResponse(BaseModel):
    title: str
    language: Language
    sections: list[LyricSection]
    covered_concepts: list[str]
    review_required: bool = True
