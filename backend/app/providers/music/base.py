from abc import ABC, abstractmethod
from dataclasses import dataclass

@dataclass
class MusicResult:
    status: str
    audio_url: str | None = None
    provider_job_id: str | None = None
    message: str | None = None

class MusicProvider(ABC):
    @abstractmethod
    async def generate(self, *, lyrics: str, language: str, style: str) -> MusicResult:
        """Generate vocal music; implementations return validated provider output."""
        raise NotImplementedError
