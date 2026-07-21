from __future__ import annotations

from typing import List

import fitz


class OCRService:
    def extract_text(self, file_bytes: bytes) -> str:
        try:
            doc = fitz.open(stream=file_bytes, filetype="pdf")
            texts = [page.get_text("text") for page in doc]
            return "\n".join(text for text in texts if text).strip()
        except Exception:
            return ""
