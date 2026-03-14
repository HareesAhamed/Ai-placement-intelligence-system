# PrepIQ Backend

## Run locally

1. Create `.env` from `.env.example`.
2. Build execution image:

```bash
docker build -f executor.Dockerfile -t prepiq-executor:latest .
```

3. Install dependencies and run API:

```bash
python -m venv venv
venv\Scripts\Activate.ps1
pip install -r requirements.txt
uvicorn app.main:app --reload
```

4. Start Postgres (optional via compose):

```bash
docker compose up db -d
```

## Core endpoints

- `POST /auth/register`
- `POST /auth/login`
- `POST /execute` (JWT required)
- `GET /problems`
- `POST /problems`
- `POST /submissions` (JWT required)
- `GET /submissions` (JWT required)
- `GET /submissions/analytics/summary` (JWT required)
