from typing import Any, Literal, TypedDict

class Pyproject(TypedDict, total=False):
    project: dict[str, Any]
    tool: dict[Literal["pythonline"], Config]

class Config(TypedDict, total=False):
    scripts: dict[Literal["run", "pre_run"], str]
