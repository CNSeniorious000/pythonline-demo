import builtins
from ast import parse
from collections.abc import Callable
from contextlib import suppress
from itertools import count

from common.inspection import inspect
from pyodide.ffi import create_once_callable, to_js
from reactivity import create_effect

from .exec import ReactiveNamespace, console_exec_source, exec_source
from .stream import StreamManager


class NotebookAPI:
    def __init__(self):
        self.builtins = ReactiveNamespace(builtins.__dict__)
        self.context = ReactiveNamespace({"__builtins__": self.builtins, "__name__": "__main__", "__doc__": None, "__package__": None, "__loader__": None, "__spec__": None})
        self.counter = count(1)
        self.console_context = {}

    @property
    def filename(self):
        return f"In[{next(self.counter)}]"

    async def run(self, source: str, sync, console=False):
        if console:
            async for value in console_exec_source(self.filename, source, self.context, StreamManager(sync)):
                if value is not None:
                    self.builtins["_"] = value
        else:
            value = await exec_source(self.filename, source, self.context, StreamManager(sync))
            if value is not None:
                self.builtins["_"] = value

    def inspect(self, name: str):
        return to_js(inspect(name, self.context, self.console_context, self.builtins))

    def watch(self, name: str, callback: Callable):
        effect = create_effect(lambda: callback(self.inspect(name)))
        return create_once_callable(effect.dispose)

    @staticmethod
    def is_python(source: str):
        with suppress(SyntaxError):
            parse(source)
            return True
        return False

    def inject_globals(self, context):
        self.context |= {**context, **self.context}
        self.console_context = context
