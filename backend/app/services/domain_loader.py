import os
import glob
import yaml
from functools import lru_cache
from typing import List, Dict, Any


@lru_cache(maxsize=1)
def load_domains(base_path: str) -> List[Dict[str, Any]]:
    """Load all domain YAML files into a list of dicts."""
    pattern = os.path.join(base_path, "*.yaml")
    domains = []
    for path in sorted(glob.glob(pattern)):
        with open(path, "r", encoding="utf-8") as f:
            domains.append(yaml.safe_load(f))
    return domains
