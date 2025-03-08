from __future__ import annotations

from pathlib import Path
from typing import TYPE_CHECKING

if TYPE_CHECKING:
    from .types import Pyproject


def get_scripts():
    file = Path("pyproject.toml")
    if not file.exists():
        return None, None

    from tomllib import loads

    data: Pyproject = loads(file.read_text())  # type: ignore

    scripts = data.get("tool", {}).get("pythonline", {}).get("scripts", {})

    return read_file(scripts.get("pre_run")), read_file(scripts.get("run"))


def read_file(file: str | None):
    if file is not None:
        return Path(file).read_text()
