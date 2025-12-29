# NIS2TOOL

Minimal, production-ready MVP for a NIS-2 compliance dashboard for SMEs.

## Stack & Layout
- Backend: FastAPI + SQLite, Pydantic, JWT auth (email/password)
- Frontend: React + TypeScript + Vite + Tailwind (shadcn-compatible), client-side routing
- Data source: YAML domain/checklists under data/domains (derived from https://github.com/ruppfabian1997/CoC-NIS-2)

Repo structure (required):
```
backend/app/{main.py,models.py,schemas.py,routes/,services/,deps.py,database.py}
frontend/{src/components,src/pages,src/services}
data/domains/*.yaml
```

## Run locally
Backend
```
cd backend
python -m venv .venv && source .venv/bin/activate
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
```

Frontend
```
cd frontend
npm install
npm run dev -- --host --port 5173
```

Environment
- `DATABASE_URL` (optional, default sqlite:///./nis2.db)
- `JWT_SECRET` (optional, default dev-secret-key)
- Frontend API base: `VITE_API_BASE_URL` (default http://localhost:8000)

## Smoke test (manual)
1) Start backend + frontend
2) Register/login (demo@example.com / password works)
3) Fetch domains (dashboard tiles appear at 0%)
4) Run assessment (answer all questions domain by domain)
5) View results (overall + per-domain scores update)
6) Generate tasks (Kanban backlog populated from measures)
7) Move tasks across Kanban columns

## Data model (minimal)
- Domain (id, title, questions[{id,text,type}], measures[{id,title,priority}])
- AssessmentAnswer (company_id, domain_id, question_id, value)
- DomainScore (company_id, domain_id, score_percent)
- OverallScore (company_id, score_percent)
- Task (company_id, domain_id, measure_id, title, priority, status backlog|in_progress|done)

Scoring: scale 0–4; boolean true→4/false→0; domain score = sum/max*100; overall = avg(domain scores).

## Notes
- YAML lives in data/domains and is the single source of truth for domains/questions/measures.
- Tasks are generated from measures per domain and start in backlog.
- No out-of-scope features: evidence upload, exports, notifications, AI, external integrations, multi-tenant billing.