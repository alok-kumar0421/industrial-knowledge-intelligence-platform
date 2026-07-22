from __future__ import annotations

import logging
from typing import List

from fastembed import TextEmbedding

from app.core.config import EMBEDDING_MODEL

logger = logging.getLogger(__name__)

_embedding_service = None


def get_embedding_service() -> "EmbeddingService":
    global _embedding_service

    if _embedding_service is None:
        logger.info("Initializing FastEmbed...")
        _embedding_service = EmbeddingService()

    return _embedding_service


def initialize_embedding_service() -> None:
    logger.info("Embedding service ready (FastEmbed Lazy Mode)")


class EmbeddingService:

    def __init__(self) -> None:
        self.model = None

    def _ensure_loaded(self) -> None:
        if self.model is not None:
            return

        logger.info(
            "Loading FastEmbed model: %s",
            EMBEDDING_MODEL,
        )

        self.model = TextEmbedding(
            model_name=EMBEDDING_MODEL,
        )

        logger.info("FastEmbed model loaded.")

    def embed_text(self, text: str) -> List[float]:
        self._ensure_loaded()

        embedding = next(
            self.model.embed([text])
        )

        return embedding.tolist()

    def embed_batch(
        self,
        texts: List[str],
    ) -> List[List[float]]:

        self._ensure_loaded()

        return [
            emb.tolist()
            for emb in self.model.embed(texts)
        ]

    def is_available(self) -> bool:
        """
        FastEmbed is always available.
        The model loads lazily when embed_text() or embed_batch() is called.
        """
        return True