from __future__ import annotations

from datetime import datetime, timezone
from typing import Optional

from app.core.config import (
    DEFAULT_ROLE,
    OWNER_NAME,
    OWNER_EMAIL,
    OWNER_USERNAME,
    OWNER_PASSWORD,
)

import bcrypt
from sqlalchemy.orm import Session

from app.core.security import create_token
from app.db.models import User


class AuthService:
    def __init__(self, db: Session) -> None:
        self.db = db

    def register(
        self,
        *,
        name: str,
        email: str,
        username: str,
        password: str,
        role: str = DEFAULT_ROLE,
    ) -> User:

        if role == "owner":
            raise ValueError("Owner account cannot be created.")

        existing = (
            self.db.query(User)
            .filter((User.username == username) | (User.email == email))
            .first()
        )

        if existing:
            raise ValueError("Username or email already exists.")

        hashed = bcrypt.hashpw(
            password.encode(),
            bcrypt.gensalt()
        ).decode()

        user = User(
            name=name,
            email=email,
            username=username,
            password_hash=hashed,
            role="worker",
            approved=False,
            created_at=datetime.now(timezone.utc),
        )

        self.db.add(user)
        self.db.commit()
        self.db.refresh(user)

        return user

    def authenticate(self, username: str, password: str) -> Optional[tuple[User, str]]:
        self._ensure_seed_users()
        user = self.db.query(User).filter(User.username == username).first()
        if not user:
            return None
        if not self._password_matches(password, user.password_hash):
            return None
        if user.role == "worker" and not user.approved:
            raise ValueError("Your account has not been authorized. Please contact the owner.")
        token = create_token(user.username, user.role)
        return user, token

    def _ensure_seed_users(self) -> None:

        existing = self.get_user(OWNER_USERNAME)

        hashed = bcrypt.hashpw(
            OWNER_PASSWORD.encode("utf-8"),
            bcrypt.gensalt()
        ).decode("utf-8")

        if existing:
            existing.name = OWNER_NAME
            existing.email = OWNER_EMAIL
            existing.password_hash = hashed
            existing.role = "owner"
            existing.approved = True

            self.db.commit()
            return

        owner = User(
            name=OWNER_NAME,
            email=OWNER_EMAIL,
            username=OWNER_USERNAME,
            password_hash=hashed,
            role="owner",
            approved=True,
            created_at=datetime.now(timezone.utc),
        )

        self.db.add(owner)
        self.db.commit()

    def _password_matches(self, password: str, password_hash: str) -> bool:
        try:
            return bcrypt.checkpw(password.encode("utf-8"), password_hash.encode("utf-8"))
        except ValueError:
            return False

    def get_user(self, username: str) -> Optional[User]:
        return self.db.query(User).filter(User.username == username).first()
