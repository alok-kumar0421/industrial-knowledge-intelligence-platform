from __future__ import annotations

import logging
import os
from typing import List
from pathlib import Path

from app.core.config import EMBEDDING_CACHE_DIR, EMBEDDING_MODEL

try:
    from sentence_transformers import SentenceTransformer
except ImportError as exc:
    raise RuntimeError("sentence-transformers package is required for embeddings") from exc

logger = logging.getLogger(__name__)

os.environ.setdefault("HUGGINGFACE_HUB_REQUEST_TIMEOUT", "120")

_embedding_service: "EmbeddingService" | None = None


def get_embedding_service() -> "EmbeddingService":
    if _embedding_service is None:
        raise RuntimeError("EmbeddingService has not been initialized. Ensure FastAPI startup has run.")
    return _embedding_service


def initialize_embedding_service() -> None:
    global _embedding_service
    if _embedding_service is not None:
        return
    _embedding_service = EmbeddingService()
    logger.info("Embedding model loaded: %s", EMBEDDING_MODEL)


class EmbeddingService:
    def __init__(self) -> None:
        self.model = None
        self._load_model()

    def _load_model(self) -> None:
        cache_path = Path(EMBEDDING_CACHE_DIR)
        cache_path.mkdir(parents=True, exist_ok=True)
        logger.info("Initializing SentenceTransformer model %s with local cache %s", EMBEDDING_MODEL, cache_path)
        self.model = SentenceTransformer(
            str(EMBEDDING_MODEL),
            cache_folder=str(cache_path),
            local_files_only=False,
        )
        logger.info("SentenceTransformer model initialization complete")

    def embed_text(self, text: str) -> List[float]:
        return self.model.encode(text).tolist()

    def embed_batch(self, texts: List[str]) -> List[List[float]]:
        return self.model.encode(texts).tolist()

    def is_available(self) -> bool:
        """
        Returns True if the embedding model has been loaded successfully.
        """
        return self.model is not None