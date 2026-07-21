from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.core.auth import require_owner
from app.db.models import User
from app.db.session import get_db

router = APIRouter()


@router.get("/pending")
def pending_workers(
    owner: User = Depends(require_owner),
    db: Session = Depends(get_db),
):

    workers = (
        db.query(User)
        .filter(
            User.role == "worker",
            User.approved == False,
        )
        .all()
    )

    return [
        {
            "id": worker.id,
            "name": worker.name,
            "email": worker.email,
            "username": worker.username,
        }
        for worker in workers
    ]

@router.get("/approved")
def approved_workers(
    owner: User = Depends(require_owner),
    db: Session = Depends(get_db),
):

    workers = (
        db.query(User)
        .filter(
            User.role == "worker",
            User.approved == True,
        )
        .all()
    )

    return [
        {
            "id": worker.id,
            "name": worker.name,
            "email": worker.email,
            "username": worker.username,
        }
        for worker in workers
    ]

@router.post("/{user_id}/approve")
def approve_worker(
    user_id: int,
    owner: User = Depends(require_owner),
    db: Session = Depends(get_db),
):

    worker = db.query(User).filter(User.id == user_id).first()

    if worker is None:
        raise HTTPException(404, "Worker not found")

    worker.approved = True

    db.commit()

    return {"message": "Worker approved successfully"}


@router.delete("/{user_id}")
def reject_worker(
    user_id: int,
    owner: User = Depends(require_owner),
    db: Session = Depends(get_db),
):

    worker = db.query(User).filter(User.id == user_id).first()

    if worker is None:
        raise HTTPException(404, "Worker not found")

    db.delete(worker)

    db.commit()

    return {"message": "Worker rejected"}

@router.post("/{user_id}/disable")
def disable_worker(
    user_id: int,
    owner: User = Depends(require_owner),
    db: Session = Depends(get_db),
):

    worker = db.query(User).filter(User.id == user_id).first()

    if worker is None:
        raise HTTPException(404, "Worker not found")

    worker.approved = False

    db.commit()

    return {
        "message": "Worker disabled successfully"
    }