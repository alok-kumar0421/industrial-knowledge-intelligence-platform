from __future__ import annotations

import os
from typing import List

import requests

from app.core.config import GROQ_API_KEY, GROQ_MODEL


class LLMService:
    def __init__(self) -> None:
        self.api_key = GROQ_API_KEY
        self.model = GROQ_MODEL

    def generate_answer(self, *, question: str, context: str) -> str:
        if not self.api_key:
            return "I could not connect to the LLM service. Please configure GROQ_API_KEY."
        payload = {
            "model": self.model,
            "messages": [
                {
                    "role": "system",
                    "content": "Answer using only the provided context. If the answer is not present, say exactly: I could not find this information inside uploaded documents.",
                },
                {"role": "user", "content": f"Question: {question}\n\nContext:\n{context}"},
            ],
            "temperature": 0.1,
        }
        headers = {"Authorization": f"Bearer {self.api_key}", "Content-Type": "application/json"}
        response = requests.post("https://api.groq.com/openai/v1/chat/completions", headers=headers, json=payload, timeout=60)
        response.raise_for_status()
        data = response.json()
        return data["choices"][0]["message"]["content"].strip()
