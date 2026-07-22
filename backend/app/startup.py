from __future__ import annotations

import logging

from fastapi import FastAPI

from app.services.embedding_service import initialize_embedding_service
from app.services.vectorstore_service import initialize_vector_store_service

logger = logging.getLogger(__name__)


def configure_startup(app: FastAPI) -> None:
    @app.on_event("startup")
    async def startup_event() -> None:
        logger.info("🚀 Starting Backend...")

        initialize_embedding_service()
        initialize_vector_store_service()

        logger.info("✅ Backend Ready")