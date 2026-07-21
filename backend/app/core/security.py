import base64
import hashlib
import hmac
import json
import time
from typing import Any, Dict

from app.core.config import JWT_ALGORITHM, JWT_SECRET


def create_token(subject: str, role: str) -> str:
    payload = {
        "sub": subject,
        "role": role,
        "iat": int(time.time()),
        "exp": int(time.time()) + 60 * 60 * 8,
    }
    header = {"alg": JWT_ALGORITHM, "typ": "JWT"}
    encoded_header = base64.urlsafe_b64encode(json.dumps(header, separators=(",", ":")).encode()).rstrip(b"=").decode()
    encoded_payload = base64.urlsafe_b64encode(json.dumps(payload, separators=(",", ":")).encode()).rstrip(b"=").decode()
    signing_input = f"{encoded_header}.{encoded_payload}".encode()
    signature = hmac.new(JWT_SECRET.encode(), signing_input, hashlib.sha256).digest()
    encoded_signature = base64.urlsafe_b64encode(signature).rstrip(b"=").decode()
    return f"{encoded_header}.{encoded_payload}.{encoded_signature}"


def decode_token(token: str) -> Dict[str, Any]:
    if not token or token.count(".") != 2:
        raise ValueError("Invalid token")
    header_b64, payload_b64, signature_b64 = token.split(".")
    signing_input = f"{header_b64}.{payload_b64}".encode()
    expected_signature = base64.urlsafe_b64encode(
        hmac.new(JWT_SECRET.encode(), signing_input, hashlib.sha256).digest()
    ).rstrip(b"=").decode()
    if not hmac.compare_digest(signature_b64, expected_signature):
        raise ValueError("Invalid token signature")
    payload = json.loads(base64.urlsafe_b64decode(payload_b64 + "=" * (-len(payload_b64) % 4)))
    if payload.get("exp", 0) < int(time.time()):
        raise ValueError("Token expired")
    return payload
