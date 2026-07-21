from fastapi import FastAPI
import logging

from app.services.embedding_service import initialize_embedding_service
from app.services.vectorstore_service import initialize_vector_store_service

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format="%(levelname)s: %(message)s",
)

# Hide unnecessary library logs
logging.getLogger("httpx").setLevel(logging.WARNING)
logging.getLogger("httpcore").setLevel(logging.WARNING)
logging.getLogger("huggingface_hub").setLevel(logging.ERROR)
logging.getLogger("sentence_transformers").setLevel(logging.WARNING)
logging.getLogger("transformers").setLevel(logging.ERROR)
logging.getLogger("chromadb").setLevel(logging.WARNING)

logger = logging.getLogger(__name__)


def configure_startup(app: FastAPI) -> None:

    @app.on_event("startup")
    def startup_event() -> None:
        logger.info("🚀 Starting Backend...")

        # initialize_embedding_service()
        # initialize_vector_store_service()

        logger.info("✅ Backend Ready")