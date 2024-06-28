# This is a stub file for global variables provided by the js side of pyodide.

from collections.abc import Callable
from typing import TypeVar

Function = TypeVar("Function", bound=Callable)

def with_toast(*, loading: str, success: str = ..., duration: int = ...) -> Callable[[Function], Function]: ...

class Toast[Id]:
    def dismiss(self, id: Id): ...
    def loading(self, message: str, *, id: Id | None = None) -> Id: ...
    def success(self, message: str, *, id: Id | None = None, duration: int | None = None) -> Id: ...
    def warning(self, message: str, *, id: Id | None = None, duration: int | None = None) -> Id: ...

toast: Toast[str]
