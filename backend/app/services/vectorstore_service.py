from __future__ import annotations

import logging
from typing import Any, Dict, List, Optional

from qdrant_client import QdrantClient, models

from app.core.config import (
    QDRANT_API_KEY,
    QDRANT_COLLECTION,
    QDRANT_URL,
)

logger = logging.getLogger(__name__)

_vector_store_service = None


def get_vector_store_service():
    global _vector_store_service

    if _vector_store_service is None:
        _vector_store_service = VectorStoreService()

    return _vector_store_service


def initialize_vector_store_service():
    logger.info("Vector Store initialized (Qdrant Lazy Mode)")


class VectorStoreService:

    _client = None

    def __init__(self):
        self.client = None
        self._loaded = False

    def _ensure_loaded(self):

        if self._loaded:
            return

        if VectorStoreService._client is None:

            logger.info("Connecting to Qdrant Cloud...")

            VectorStoreService._client = QdrantClient(
                url=QDRANT_URL,
                api_key=QDRANT_API_KEY,
            )

        self.client = VectorStoreService._client

        collections = self.client.get_collections().collections

        names = [c.name for c in collections]

        if QDRANT_COLLECTION not in names:

            logger.info("Creating collection...")

            self.client.create_collection(
                collection_name=QDRANT_COLLECTION,
                vectors_config=models.VectorParams(
                    size=384,
                    distance=models.Distance.COSINE,
                ),
            )

        self._loaded = True

        logger.info("Qdrant ready.")

    def add_documents(
        self,
        documents: List[Dict[str, Any]],
        embeddings: Optional[List[List[float]]] = None,
    ):

        self._ensure_loaded()

        if not documents:
            return

        if embeddings is None:
            raise ValueError("Embeddings required")

        points = []

        for doc, emb in zip(documents, embeddings):

            points.append(
                models.PointStruct(
                    id=doc["id"],
                    vector=emb,
                    payload={
                        "content": doc["content"],
                        **doc["metadata"],
                    },
                )
            )

        self.client.upsert(
            collection_name=QDRANT_COLLECTION,
            points=points,
        )

        logger.info("Inserted %d vectors", len(points))

    def delete_by_ids(
        self,
        ids: List[str],
    ):

        self._ensure_loaded()

        if not ids:
            return

        self.client.delete(
            collection_name=QDRANT_COLLECTION,
            points_selector=models.PointIdsList(
                points=ids
            ),
            wait=True,
        )

    def query(
        self,
        query_text: str,
        top_k: int = 5,
        query_embedding: Optional[List[float]] = None,
    ):

        self._ensure_loaded()

        if query_embedding is None:
            raise ValueError("Embedding required")

        response = self.client.query_points(
            collection_name=QDRANT_COLLECTION,
            query=query_embedding,
            limit=top_k,
        )

        hits = []

        for point in response.points:

            payload = point.payload or {}

            hits.append(
                {
                    "content": payload.get("content", ""),
                    "metadata": payload,
                    "distance": point.score,
                }
            )

        return hits

    def get_stats(self):

        self._ensure_loaded()

        info = self.client.get_collection(
            QDRANT_COLLECTION
        )

        return {
            "available": True,
            "collection_name": QDRANT_COLLECTION,
            "total_vectors": info.points_count,
        }

    def reset(self):

        self._ensure_loaded()

        self.client.delete_collection(
            QDRANT_COLLECTION
        )

        self.client.create_collection(
            collection_name=QDRANT_COLLECTION,
            vectors_config=models.VectorParams(
                size=384,
                distance=models.Distance.COSINE,
            ),
        )