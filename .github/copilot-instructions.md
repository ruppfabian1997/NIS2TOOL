# Copilot Instructions for NIS2TOOL

Purpose: Build a minimal, production-ready MVP for a NIS-2 compliance dashboard for SMEs.

## Source of Truth
- NIS-2 domains/checklists/measures come from https://github.com/ruppfabian1997/CoC-NIS-2 (authoritative). Do not invent requirements.
- Data is (or will be) structured as YAML under data/domains/*.yaml (one file per domain/baustein).

## Architecture & Stack
- Frontend: React + TypeScript + Vite + Tailwind CSS + shadcn/ui, client-side routing.
- Backend: FastAPI (Python) + SQLite (MVP), Pydantic models, REST API.
- Auth: email + password with JWT.
- Repository layout (must follow): frontend/, backend/app/{main.py,models.py,schemas.py,routes/,services/}, data/domains/, README.md.

## Data Model (minimal)
- Domain: id, title
- Question: id, domain_id, text, type (scale 0–4 | boolean)
- AssessmentAnswer: company_id, domain_id, question_id, value
- DomainScore: company_id, domain_id, score_percent
- OverallScore: company_id, score_percent
- Task (Kanban): company_id, domain_id, measure_id, title, priority, status (backlog|in_progress|done)

## Scoring Logic (fixed)
- Scale question: value 0–4. Boolean: true→4, false→0.
- Domain score: (sum of answers / max possible) * 100.
- Overall score: average of all domain scores.

## Required User Flows
- Register/login, persist session via JWT.
- Dashboard: grid of tiles (one per domain) showing title, maturity %, status (Not started/In progress/Completed); initial maturity 0%.
- Assessment wizard: one domain at a time; all questions required; questions sourced from YAML checklists.
- Results: overall NIS-2-Ready score and per-domain scores.
- Kanban board: columns backlog/in_progress/done; tasks derived from measures per domain; start in backlog; manageable from dashboard.

## Implementation Order (enforce)
1) Backend: load domains/questions/measures from YAML. 
2) Assessment endpoints (CRUD answers).
3) Scoring endpoints (domain + overall).
4) Kanban task generation from measures + CRUD.
5) Frontend pages/components for dashboard, assessment wizard, results, Kanban.

## Conventions
- Prefer clarity over cleverness; brief comments for non-obvious logic.
- Keep schemas and DB models aligned; use Pydantic for request/response.
- Seed minimal sample YAML and optional bootstrap data for local run.
- No out-of-scope features: evidence upload, audit exports, notifications, AI, external integrations, multi-tenant billing.

## Run/Dev (expected)
- Backend: FastAPI app in backend/app/main.py; add requirements.txt in backend/. Use SQLite file in repo or in-memory for tests.
- Frontend: Vite + Tailwind; organize shared UI in components/ and API calls in services/.

## Testing/Checks
- Provide a simple smoke path: create user → fetch domains → answer assessment → compute scores → generate tasks → view Kanban.

## Docs/Readme
- Update README with how to run backend and frontend and describe the MVP scope above.
