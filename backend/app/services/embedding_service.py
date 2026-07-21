from __future__ import annotations

import logging
import os
from pathlib import Path
from typing import List

from app.core.config import EMBEDDING_CACHE_DIR, EMBEDDING_MODEL

try:
    from sentence_transformers import SentenceTransformer
except ImportError as exc:
    raise RuntimeError(
        "sentence-transformers package is required for embeddings"
    ) from exc

logger = logging.getLogger(__name__)

os.environ.setdefault("HUGGINGFACE_HUB_REQUEST_TIMEOUT", "120")

_embedding_service = None


def get_embedding_service() -> "EmbeddingService":
    global _embedding_service

    if _embedding_service is None:
        logger.info("Lazy loading embedding service...")
        _embedding_service = EmbeddingService()

    return _embedding_service


def initialize_embedding_service() -> None:
    """
    Startup par model load nahi hoga.
    Model first embedding request par automatically load hoga.
    """
    logger.info("Embedding service initialized (Lazy Mode)")


class EmbeddingService:
    def __init__(self) -> None:
        self.model = None

    def _ensure_loaded(self) -> None:
        if self.model is not None:
            return

        cache_path = Path(EMBEDDING_CACHE_DIR)
        cache_path.mkdir(parents=True, exist_ok=True)

        logger.info(
            "Loading SentenceTransformer model: %s",
            EMBEDDING_MODEL,
        )

        self.model = SentenceTransformer(
            EMBEDDING_MODEL,
            cache_folder=str(cache_path),
            local_files_only=False,
        )

        logger.info("SentenceTransformer model loaded successfully.")

    def embed_text(self, text: str) -> List[float]:
        self._ensure_loaded()
        return self.model.encode(text).tolist()

    def embed_batch(self, texts: List[str]) -> List[List[float]]:
        self._ensure_loaded()
        return self.model.encode(texts).tolist()

    def is_available(self) -> bool:
        return self.model is not None