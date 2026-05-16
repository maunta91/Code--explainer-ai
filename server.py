from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import httpx
import os
import json
import re
from dotenv import load_dotenv

load_dotenv()

app = FastAPI(title="Code Explainer AI - Backend")

# Allow frontend (GitHub Pages or localhost) to talk to this server
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

GROQ_API_KEY = os.getenv("GROQ_API_KEY")
GROQ_URL = "https://api.groq.com/openai/v1/chat/completions"
MODEL = "llama-3.3-70b-versatile"


class CodeRequest(BaseModel):
    code: str


class QuestionRequest(BaseModel):
    question: str
    context: str


class AnalysisResult(BaseModel):
    explanation: str
    issues: list[str]
    suggestion: str


class QuestionAnswer(BaseModel):
    answer: str


def build_prompt(code: str) -> str:
    return f"""You are an expert code reviewer. Analyze the following code and respond ONLY with a raw JSON object (no markdown, no backticks).

The JSON must have exactly these three fields:
- "explanation": a plain English description of what the code does (2-4 sentences)
- "issues": an array of strings, each describing a bug, risk, or code smell found (empty array if none)
- "suggestion": an improved version of the code as a single string

Code to analyze:
{code}

Respond with raw JSON only."""


@app.post("/analyze", response_model=AnalysisResult)
async def analyze_code(request: CodeRequest):
    code = request.code.strip()

    if not code:
        raise HTTPException(status_code=400, detail="Code cannot be empty.")
    if len(code) > 10000:
        raise HTTPException(status_code=400, detail="Code is too long. Max 10,000 characters.")
    if not GROQ_API_KEY:
        raise HTTPException(status_code=500, detail="GROQ_API_KEY is not set in environment.")

    payload = {
        "model": MODEL,
        "messages": [
            {"role": "user", "content": build_prompt(code)}
        ],
        "temperature": 0.3,
        "max_tokens": 1500,
    }

    headers = {
        "Authorization": f"Bearer {GROQ_API_KEY}",
        "Content-Type": "application/json",
    }

    async with httpx.AsyncClient(timeout=30) as client:
        try:
            response = await client.post(GROQ_URL, json=payload, headers=headers)
            response.raise_for_status()
        except httpx.HTTPStatusError as e:
            raise HTTPException(status_code=502, detail=f"Groq API error: {e.response.text}")
        except httpx.RequestError as e:
            raise HTTPException(status_code=503, detail=f"Could not reach Groq API: {str(e)}")

    raw_text = response.json()["choices"][0]["message"]["content"]

    # Strip markdown fences if model wraps response anyway
    cleaned = re.sub(r"^```(?:json)?\s*|\s*```$", "", raw_text.strip())

    try:
        data = json.loads(cleaned)
    except json.JSONDecodeError:
        raise HTTPException(status_code=500, detail=f"Model returned invalid JSON: {raw_text[:300]}")

    return AnalysisResult(
        explanation=data.get("explanation", ""),
        issues=data.get("issues", []),
        suggestion=data.get("suggestion", ""),
    )


@app.post("/ask-question", response_model=QuestionAnswer)
async def ask_question(request: QuestionRequest):
    question = request.question.strip()
    context = request.context.strip()

    if not question:
        raise HTTPException(status_code=400, detail="Question cannot be empty.")
    if not GROQ_API_KEY:
        raise HTTPException(status_code=500, detail="GROQ_API_KEY is not set in environment.")

    prompt = f"""You are a helpful coding assistant. A user has received this explanation about their code:

{context}

The user has a follow-up question:
{question}

Provide a clear, concise answer to help them understand better. Keep your response focused and easy to understand."""

    payload = {
        "model": MODEL,
        "messages": [
            {"role": "user", "content": prompt}
        ],
        "temperature": 0.5,
        "max_tokens": 500,
    }

    headers = {
        "Authorization": f"Bearer {GROQ_API_KEY}",
        "Content-Type": "application/json",
    }

    async with httpx.AsyncClient(timeout=30) as client:
        try:
            response = await client.post(GROQ_URL, json=payload, headers=headers)
            response.raise_for_status()
        except httpx.HTTPStatusError as e:
            raise HTTPException(status_code=502, detail=f"Groq API error: {e.response.text}")
        except httpx.RequestError as e:
            raise HTTPException(status_code=503, detail=f"Could not reach Groq API: {str(e)}")

    answer = response.json()["choices"][0]["message"]["content"]

    return QuestionAnswer(answer=answer)


@app.get("/health")
async def health():
    return {"status": "ok"}