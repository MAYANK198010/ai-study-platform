from pathlib import Path
from pydantic_settings import BaseSettings, SettingsConfigDict

class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file="../.env", extra="ignore")
    app_env: str = "development"
    openai_api_key: str = ""
    openai_model: str = "gpt-4.1-mini"
    upload_dir: Path = Path("./storage/uploads")
    max_upload_mb: int = 25

    @property
    def max_upload_bytes(self) -> int:
        return self.max_upload_mb * 1024 * 1024

settings = Settings()
