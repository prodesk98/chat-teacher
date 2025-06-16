from pydantic import BaseModel
from os import environ
from dotenv import load_dotenv
load_dotenv()

class Environment(BaseModel):
    """
    Environment configuration for the application.
    """
    DEBUG: bool = bool(environ.get("DEBUG", "true") == "true")
    DATABASE_URL: str = environ.get("DATABASE_URL", "sqlite:///data/chat-teacher.db")

    OPENAI_BASE_URL: str = environ.get("OPENAI_BASE_URL", "https://api.openai.com/v1")
    OPENAI_API_KEY: str = environ.get("OPENAI_API_KEY")
    OPENAI_MODEL: str = environ.get("OPENAI_MODEL", "gpt-4o-mini")

    ELEVEN_LABS_API_KEY: str = environ.get("ELEVEN_LABS_API_KEY")
    ELEVEN_LABS_VOICE_ID: str = environ.get("ELEVEN_LABS_VOICE_ID")
    ELEVEN_LABS_MODEL_ID: str = environ.get("ELEVEN_LABS_MODEL_ID", "eleven_turbo_v2_5")

env = Environment()
if env.OPENAI_API_KEY is None:
    raise ValueError("OPENAI_API_KEY must be set in the environment variables.")

if env.ELEVEN_LABS_API_KEY is not None and env.ELEVEN_LABS_VOICE_ID is None:
    raise ValueError("ELEVEN_LABS_VOICE_ID must be set if ELEVEN_LABS_API_KEY is provided.")
