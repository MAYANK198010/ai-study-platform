from app.providers.music.base import MusicProvider, MusicResult

class MockMusicProvider(MusicProvider):
    async def generate(self, *, lyrics: str, language: str, style: str) -> MusicResult:
        # Never represent placeholder audio as a completed song.
        return MusicResult(status="unavailable", message="No music provider is configured. Configure and validate a supported provider before enabling audio generation.")
