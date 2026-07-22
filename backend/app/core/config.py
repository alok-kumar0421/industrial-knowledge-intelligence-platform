# import os
# from pathlib import Path

# from dotenv import load_dotenv

# load_dotenv()

# BASE_DIR = Path(__file__).resolve().parent.parent.parent
# DATA_DIR = BASE_DIR / "data"
# UPLOAD_DIR = DATA_DIR / "uploads"
# CHROMA_DIR = DATA_DIR / "chroma"
# UPLOAD_DIR.mkdir(parents=True, exist_ok=True)
# CHROMA_DIR.mkdir(parents=True, exist_ok=True)

# APP_TITLE = os.getenv("APP_TITLE", "Industrial Knowledge Intelligence Platform")
# API_PREFIX = os.getenv("API_PREFIX", "/api/v1")
# JWT_SECRET = os.getenv("JWT_SECRET", "industrial-hackathon-secret")
# JWT_ALGORITHM = os.getenv("JWT_ALGORITHM", "HS256")
# GROQ_API_KEY = os.getenv("GROQ_API_KEY", "")
# GROQ_MODEL = os.getenv("GROQ_MODEL", "llama-3.3-70b-versatile")
# DEFAULT_ROLE = os.getenv("DEFAULT_ROLE", "worker")
# DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///./app.db")
# CHROMA_COLLECTION = os.getenv("CHROMA_COLLECTION", "industrial_documents")
# EMBEDDING_MODEL = os.getenv("EMBEDDING_MODEL", "sentence-transformers/all-MiniLM-L6-v2")
# EMBEDDING_CACHE_DIR = os.getenv("EMBEDDING_CACHE_DIR", str(DATA_DIR / "embeddings"))
# CHUNK_SIZE = int(os.getenv("CHUNK_SIZE", "250"))
# CHUNK_OVERLAP = int(os.getenv("CHUNK_OVERLAP", "50"))
# TOP_K = int(os.getenv("TOP_K", "5"))

# OWNER_NAME = os.getenv("OWNER_NAME", "Owner")
# OWNER_EMAIL = os.getenv("OWNER_EMAIL", "owner@example.com")
# OWNER_USERNAME = os.getenv("OWNER_USERNAME", "owner")
# OWNER_PASSWORD = os.getenv("OWNER_PASSWORD", "owner123")

import os
from pathlib import Path

from dotenv import load_dotenv

load_dotenv()

BASE_DIR = Path(__file__).resolve().parent.parent.parent
DATA_DIR = BASE_DIR / "data"
UPLOAD_DIR = DATA_DIR / "uploads"

DATA_DIR.mkdir(parents=True, exist_ok=True)
UPLOAD_DIR.mkdir(parents=True, exist_ok=True)

APP_TITLE = os.getenv(
    "APP_TITLE",
    "Industrial Knowledge Intelligence Platform",
)

API_PREFIX = os.getenv("API_PREFIX", "/api/v1")

JWT_SECRET = os.getenv(
    "JWT_SECRET",
    "industrial-hackathon-secret",
)

JWT_ALGORITHM = os.getenv("JWT_ALGORITHM", "HS256")

DATABASE_URL = os.getenv("DATABASE_URL")

if not DATABASE_URL:
    raise ValueError(
        "DATABASE_URL environment variable is required."
    )

DEFAULT_ROLE = os.getenv("DEFAULT_ROLE", "worker")

# -------------------------
# Groq
# -------------------------

GROQ_API_KEY = os.getenv("GROQ_API_KEY", "")

GROQ_MODEL = os.getenv(
    "GROQ_MODEL",
    "llama-3.3-70b-versatile",
)

# -------------------------
# Qdrant
# -------------------------

QDRANT_URL = os.getenv("QDRANT_URL", "")

QDRANT_API_KEY = os.getenv("QDRANT_API_KEY", "")

QDRANT_COLLECTION = os.getenv(
    "QDRANT_COLLECTION",
    "industrial_documents",
)

# -------------------------
# FastEmbed
# -------------------------

EMBEDDING_MODEL = os.getenv(
    "EMBEDDING_MODEL",
    "BAAI/bge-small-en-v1.5",
)

# -------------------------
# Chunking
# -------------------------

CHUNK_SIZE = int(os.getenv("CHUNK_SIZE", "250"))

CHUNK_OVERLAP = int(
    os.getenv("CHUNK_OVERLAP", "50")
)

TOP_K = int(os.getenv("TOP_K", "5"))

# -------------------------
# Default Owner
# -------------------------

OWNER_NAME = os.getenv("OWNER_NAME", "Owner")

OWNER_EMAIL = os.getenv(
    "OWNER_EMAIL",
    "owner@example.com",
)

OWNER_USERNAME = os.getenv(
    "OWNER_USERNAME",
    "owner",
)

OWNER_PASSWORD = os.getenv(
    "OWNER_PASSWORD",
    "owner123",
)