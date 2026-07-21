from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api.v1.api import router as api_router
from app.core.config import API_PREFIX, APP_TITLE
from app.startup import configure_startup

app = FastAPI(title=APP_TITLE)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
app.include_router(api_router, prefix=API_PREFIX)
configure_startup(app)


@app.get("/health")
def health_check() -> dict:
    return {"status": "ok"}
