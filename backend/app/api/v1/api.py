from fastapi import APIRouter
from app.api.v1.routes import (
    auth,
    chat,
    dashboard,
    debug,
    documents,
    users,
)

router = APIRouter()
router.include_router(auth.router, prefix="/auth", tags=["auth"])
router.include_router(documents.router, prefix="/documents", tags=["documents"])
router.include_router(chat.router, prefix="/chat", tags=["chat"])
router.include_router(dashboard.router, prefix="/dashboard", tags=["dashboard"])
router.include_router(debug.router, prefix="/debug", tags=["debug"])
router.include_router(
    users.router,
    prefix="/users",
    tags=["users"],
)

# from fastapi import APIRouter

# router = APIRouter()