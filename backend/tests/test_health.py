from fastapi.testclient import TestClient
from main import app


def test_health_endpoint() -> None:
    with TestClient(app) as client:
        response = client.get("/health")
        assert response.status_code == 200
        assert response.json()["status"] == "ok"


def test_login_returns_token() -> None:
    with TestClient(app) as client:
        response = client.post(
            "/api/v1/auth/login",
            json={"username": "worker", "password": "worker123"},
        )
        assert response.status_code == 200
        assert response.json()["role"] == "worker"


def test_chat_requires_authentication() -> None:
    with TestClient(app) as client:
        response = client.post(
            "/api/v1/chat",
            json={"question": "What is the maintenance procedure?"},
        )
        assert response.status_code == 401


def test_debug_index_requires_authentication() -> None:
    with TestClient(app) as client:
        response = client.get("/api/v1/debug/index")
        assert response.status_code == 401


def test_debug_index_returns_status() -> None:
    with TestClient(app) as client:
        response = client.post(
            "/api/v1/auth/login",
            json={"username": "worker", "password": "worker123"},
        )
        assert response.status_code == 200
        token = response.json()["access_token"]

        debug_response = client.get(
            "/api/v1/debug/index",
            headers={"Authorization": f"Bearer {token}"},
        )
        assert debug_response.status_code == 200
        body = debug_response.json()
        assert "available" in body
        assert "total_vectors" in body
