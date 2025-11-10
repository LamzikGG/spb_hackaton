from pydantic_settings import BaseSettings 

class Settings(BaseSettings):
    app_name: str = "SPB Hackation"
    debug: bool = True
    database_url: str = "sqlite+aiosqlite:///./app.db"
    cors_origins: list = [
        "http://localhost:8000",
        "http://localhost:3000",
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "http://127.0.0.1:3000",
    ]
    static_dir: str = "static"
    images_dir: str = "static/images"
    secret_key: str = "your-secret-key-change-in-production"
    algorithm: str = "HS256"
    access_token_expire_minutes: int = 30

    class Config:
        env_file = ".env"

settings = Settings()