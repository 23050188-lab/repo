import os  # <--- QUAN TRỌNG: Phải có dòng này mới dùng được os.getenv

class Settings:
    PROJECT_NAME: str = "TFlashcard"

    SECRET_KEY: str = os.getenv("SECRET_KEY", "09d25e094faa6ca2556c818166b7a9563b93f7099f6f0f4caa6cf63b88e8d3e7") 
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24

    # Cấu hình Database với user admin vừa tạo
    DATABASE_URL: str = os.getenv(
        "DATABASE_URL",
        "mysql+mysqlconnector://admin:123456@localhost/tflashcard_db"
    )

settings = Settings()
