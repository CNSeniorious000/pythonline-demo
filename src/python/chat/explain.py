from .llm import generate
from .templates import explain_error


async def explain(traceback: str, code: str):
    async for i in generate(await explain_error.arender({"traceback": traceback, "code": code})):
        assert isinstance(i, str)
        yield i
