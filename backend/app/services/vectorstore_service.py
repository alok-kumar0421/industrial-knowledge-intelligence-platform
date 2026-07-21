from __future__ import annotations

import logging
from typing import Any, Dict, List, Optional

import chromadb
from chromadb.config import Settings

from app.core.config import (
    CHROMA_COLLECTION,
    CHROMA_DIR,
)

logger = logging.getLogger(__name__)

_vector_store_service = None


def get_vector_store_service():
    global _vector_store_service

    if _vector_store_service is None:
        raise RuntimeError("VectorStoreService is not initialized.")

    return _vector_store_service


def initialize_vector_store_service():
    global _vector_store_service

    if _vector_store_service is None:
        _vector_store_service = VectorStoreService()

    logger.info("Chroma initialized")
    logger.info("Collection : %s", CHROMA_COLLECTION)
    logger.info("Vectors : %d", _vector_store_service.collection.count())


class VectorStoreService:

    _client = None
    _collection = None

    def __init__(self):

        if VectorStoreService._client is None:

            logger.info("Opening Chroma Persistent Client")

            VectorStoreService._client = chromadb.PersistentClient(
                path=str(CHROMA_DIR),
                settings=Settings(
                    allow_reset=True
                )
            )

        self.client = VectorStoreService._client

        if VectorStoreService._collection is None:

            logger.info("Opening Collection")

            VectorStoreService._collection = self.client.get_or_create_collection(
                name=CHROMA_COLLECTION
            )

        self.collection = VectorStoreService._collection

    def add_documents(
        self,
        documents: List[Dict[str, Any]],
        embeddings: Optional[List[List[float]]] = None,
    ) -> None:

        if not documents:
            return

        ids = [doc["id"] for doc in documents]
        texts = [doc["content"] for doc in documents]
        metadatas = [doc["metadata"] for doc in documents]

        try:
            self.collection.delete(ids=ids)
        except Exception:
            pass

        kwargs = {
            "ids": ids,
            "documents": texts,
            "metadatas": metadatas,
        }

        if embeddings is not None:
            kwargs["embeddings"] = embeddings

        self.collection.add(**kwargs)

        logger.info("Inserted %d vectors", len(ids))

    def delete_by_ids(self, ids: List[str]):

        if not ids:
            return

        self.collection.delete(ids=ids)

        logger.info("Deleted %d vectors", len(ids))

    def query(
        self,
        query_text: str,
        top_k: int = 5,
        query_embedding: Optional[List[float]] = None,
    ) -> List[Dict[str, Any]]:

        if not query_text.strip():
            return []

        kwargs = {
            "n_results": top_k,
        }

        if query_embedding is not None:

            kwargs["query_embeddings"] = [
                query_embedding
            ]

        else:

            kwargs["query_texts"] = [
                query_text
            ]

        results = self.collection.query(**kwargs)

        documents = results.get("documents", [[]])[0]
        metadatas = results.get("metadatas", [[]])[0]
        distances = results.get("distances", [[]])[0]

        # logger.info("=" * 60)
        # logger.info("QUESTION : %s", query_text)
        # logger.info("VECTOR COUNT : %d", self.collection.count())
        # logger.info("RETRIEVED : %d", len(documents))
        # logger.info("=" * 60)

        hits = []

        for i, doc in enumerate(documents):

            hits.append(
                {
                    "content": doc,
                    "metadata": metadatas[i] if i < len(metadatas) else {},
                    "distance": distances[i] if i < len(distances) else 0.0,
                }
            )

        return hits

    def get_stats(self) -> Dict[str, Any]:
        """
        Returns basic information about the vector database.
        """

        return {
            "available": True,
            "collection_name": CHROMA_COLLECTION,
            "persist_directory": str(CHROMA_DIR),
            "total_vectors": self.collection.count(),
        }

    def reset(self) -> None:
        """
        Delete all vectors and recreate the collection.
        """

        logger.warning("Resetting Chroma collection...")

        try:
            self.client.delete_collection(CHROMA_COLLECTION)
        except Exception:
            pass

        self.collection = self.client.get_or_create_collection(
            name=CHROMA_COLLECTION
        )

        VectorStoreService._collection = self.collection

        logger.info("Collection recreated successfully.")