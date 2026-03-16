# PrepIQ Backend

## Run locally

1. Create `.env` from `.env.example`.
2. Build execution image:

```bash
docker build -f executor.Dockerfile -t prepiq-executor:latest .
```

The execution image now includes C++, Java, Python, and JavaScript runtimes.

3. Install dependencies and run API:

```bash
python -m venv venv
pip install -r requirements.txt
venv\Scripts\activate
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
- `POST /problems/{id}/bookmark` (JWT required)
- `GET /platform-connectors/accounts` (JWT required)
- `POST /platform-connectors/accounts` (JWT required)
- `GET /platform-connectors/stats` (JWT required)
- `POST /platform-connectors/sync` (JWT required)
- `GET /contests`
- `POST /contests/sync`
