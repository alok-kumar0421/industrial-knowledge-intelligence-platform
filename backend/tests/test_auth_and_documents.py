from io import BytesIO

from fastapi.testclient import TestClient

from main import app


def test_register_and_document_upload_flow() -> None:
    with TestClient(app) as client:
        username = "qauser"
        response = client.post(
            "/api/v1/auth/register",
            json={
                "name": "QA User",
                "email": "qa@example.com",
                "username": username,
                "password": "secret123",
                "role": "owner",
            },
        )
        assert response.status_code == 200
        token = response.json()["access_token"]

        pdf_bytes = b"%PDF-1.4\n1 0 obj<</Type/Catalog/Pages 2 0 R>>endobj\n2 0 obj<</Type/Pages/Count 1/Kids[3 0 R]>>endobj\n3 0 obj<</Type/Page/MediaBox[0 0 300 144]/Contents 4 0 R/Parent 2 0 R>>endobj\n4 0 obj<</Length 44>>stream\nBT /F1 12 Tf 72 72 Td (Pump inspection checklist) Tj ET\nendstream\nendobj\nxref\n0 5\n0000000000 65535 f \n0000000010 00000 n \n0000000062 00000 n \n0000000119 00000 n \n0000000209 00000 n \ntrailer<</Root 1 0 R/Size 5>>\nstartxref\n290\n%%EOF"
        upload_response = client.post(
            "/api/v1/documents",
            headers={"Authorization": f"Bearer {token}"},
            files={"file": ("checklist.pdf", BytesIO(pdf_bytes), "application/pdf")},
        )
        assert upload_response.status_code == 200
        body = upload_response.json()
        assert body["file_name"] == "checklist.pdf"
        assert body["chunk_count"] >= 1

        list_response = client.get("/api/v1/documents", headers={"Authorization": f"Bearer {token}"})
        assert list_response.status_code == 200
        assert list_response.json()[0]["file_name"] == "checklist.pdf"
