# CodeXplain AI 🤖

> AI-powered code analysis tool built for the **IBM Bob Hackathon 2026** on [lablab.ai](https://lablab.ai)

---

## What It Does

Paste any code and get instant AI-powered analysis:

- 📖 **Explanation** — plain English description of what the code does
- ⚠️ **Issues Found** — bugs, security risks, and bad practices detected
- ✅ **Suggested Fix** — improved version of your code

---

## Demo

1. Open the app
2. Paste your code or click a sample button (Python / SQL / JS)
3. Click **Analyze Code**
4. See explanation, issues, and fix in under 3 seconds

---

## Tech Stack

| Layer | Tool |
|-------|------|
| Frontend | HTML, CSS, JavaScript |
| Backend | FastAPI (Python) |
| AI Model | LLaMA 3.3 70B via Groq API |
| Dev Tool | IBM Bob IDE |

---

## How IBM Bob Was Used

IBM Bob was our primary development partner throughout the entire project:

- Reviewed all code files for bugs and security issues
- Identified 7 critical vulnerabilities in early api.js
- Suggested retry logic, timeout protection, and error handling
- Improved our prompt engineering for better AI responses
- Full Bob report available in `BOB_LOG.md` and `BOB_REPORT.pdf`

---

## Setup & Run Locally

### 1. Clone the repo

```bash
git clone https://github.com/maunta91/Code--explainer-ai.git
cd Code--explainer-ai
```

### 2. Set up environment variables

```bash
cp .env.example .env
```

Open `.env` and add your Groq API key:

```
GROQ_API_KEY=your_groq_key_here
```

Get a free key at [console.groq.com](https://console.groq.com)

### 3. Install Python dependencies

```bash
pip install -r requirements.txt
```

### 4. Start the backend server

```bash
uvicorn server:app --reload
```

Server runs at `http://localhost:8000`

### 5. Open the frontend

Double click `index.html` or open it in your browser.

---

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/analyze` | Analyze code — returns explanation, issues, suggestion |
| GET | `/health` | Health check |

### Example request

```bash
curl -X POST http://localhost:8000/analyze \
  -H "Content-Type: application/json" \
  -d '{"code": "def divide(a, b): return a / b"}'
```

### Example response

```json
{
  "explanation": "This function takes two numbers and divides them...",
  "issues": [
    "Division by zero is not handled",
    "No input validation"
  ],
  "suggestion": "def divide(a, b):\n    if b == 0:\n        raise ZeroDivisionError('Cannot divide by zero')\n    return a / b"
}
```

---

## Team

Built in 48 hours for the IBM Bob Hackathon 2026

| Role | Responsibility |
|------|---------------|
| Frontend | HTML, CSS, UI design |
| Backend | FastAPI server, Python |
| AI Integration | Groq API, prompt engineering, IBM Bob |

---

## License

MIT License — free to use and modify.

---

*Made with ❤️ and IBM Bob for IBM Bob Hackathon 2026 · lablab.ai*
