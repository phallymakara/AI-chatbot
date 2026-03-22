from pydantic_settings import BaseSettings


class Settings(BaseSettings):

    # 🔐 Azure OpenAI
    AZURE_OPENAI_ENDPOINT: str
    AZURE_OPENAI_API_KEY: str
    AZURE_OPENAI_EMBEDDING_DEPLOYMENT: str

    # 🔎 Azure AI Search
    AZURE_SEARCH_ENDPOINT: str
    AZURE_SEARCH_KEY: str
    AZURE_SEARCH_INDEX: str

    # 📦 Azure Storage
    AZURE_STORAGE_CONNECTION_STRING: str
    AZURE_STORAGE_CONTAINER: str

    # 🧱 Azure SQL Database (NEW)
    DB_SERVER: str
    DB_NAME: str
    DB_USER: str
    DB_PASSWORD: str

    # ⚙️ Optional (recommended)
    DB_DRIVER: str = "ODBC Driver 18 for SQL Server"

    class Config:
        env_file = ".env"
        extra = "ignore"   # ignore unused env vars


settings = Settings()