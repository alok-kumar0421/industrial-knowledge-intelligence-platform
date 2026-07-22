from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api.v1.api import router as api_router
from app.core.config import API_PREFIX, APP_TITLE
from app.startup import configure_startup
from fastapi import Request, Response

app = FastAPI(title=APP_TITLE)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(
    api_router,
    prefix=API_PREFIX,
)

configure_startup(app)


@app.get("/")
def root():
    return {
        "status": "ok",
        "message": "Industrial Knowledge Intelligence Platform API"
    }


@app.api_route("/health", methods=["GET", "HEAD"])
def health(request: Request):
    if request.method == "HEAD":
        return Response(status_code=200)

    return {
        "status": "healthy"
    }