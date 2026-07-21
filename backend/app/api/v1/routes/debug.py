from fastapi import APIRouter, Depends

from app.core.auth import get_current_user
from app.db.models import User
from app.services.vectorstore_service import get_vector_store_service

router = APIRouter()


@router.get("/index")
def debug_index(user: User = Depends(get_current_user)) -> dict:
    store = get_vector_store_service()
    return store.get_stats()
