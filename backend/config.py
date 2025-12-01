import os
from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    APP_NAME: str = "GitStreak"
    GITHUB_CLIENT_ID: str = ""
    GITHUB_CLIENT_SECRET: str = ""
    SESSION_SECRET: str = "gitstreak_secret_session_key_2026"
    DEFAULT_REPO_OWNER: str = ""
    DEFAULT_REPO_NAME: str = "APP_Commit"
    FRONTEND_URL: str = "https://gitstreak-ny.vercel.app"

    class Config:
        env_file = ("../.env", ".env", ".env.local")
        extra = "ignore"

settings = Settings()
