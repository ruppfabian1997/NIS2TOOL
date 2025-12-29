from pathlib import Path
from typing import List

from fastapi import APIRouter

from app import schemas
from app.services.domain_loader import load_domains

router = APIRouter()

DOMAINS_DIR = Path(__file__).resolve().parents[3] / "data" / "domains"


@router.get("/", response_model=List[schemas.Domain])
def list_domains():
    return load_domains(str(DOMAINS_DIR))
