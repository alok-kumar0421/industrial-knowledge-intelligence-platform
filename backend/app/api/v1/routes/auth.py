from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.core.security import create_token
from app.db.session import get_db
from app.schemas.models import LoginRequest, RegisterRequest, TokenResponse
from app.services.auth_service import AuthService

router = APIRouter()


@router.post("/login", response_model=TokenResponse)
def login(
    payload: LoginRequest,
    db: Session = Depends(get_db),
) -> TokenResponse:

    service = AuthService(db)

    try:
        account = service.authenticate(
            payload.username,
            payload.password,
        )
    except ValueError as exc:
        raise HTTPException(
            status_code=403,
            detail=str(exc),
        )

    if account is None:
        raise HTTPException(
            status_code=401,
            detail="Invalid username or password.",
        )

    user, token = account

    return TokenResponse(
        access_token=token,
        role=user.role,
        username=user.username,
    )


@router.post("/register", response_model=TokenResponse)
def register(payload: RegisterRequest, db: Session = Depends(get_db)) -> TokenResponse:
    service = AuthService(db)
    try:
        user = service.register(
            name=payload.name,
            email=payload.email,
            username=payload.username,
            password=payload.password,
            role=payload.role,
        )
    except ValueError as exc:
        raise HTTPException(status_code=400, detail=str(exc)) from exc
    token = create_token(user.username, user.role)
    return TokenResponse(access_token=token, role=user.role, username=user.username)
