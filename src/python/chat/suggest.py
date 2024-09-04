from .llm import generate
from .templates import suggest


async def suggest_title(sources: dict[str, str]):
    async for i in generate(await suggest.arender({"sources": sources})):
        assert isinstance(i, str)
        yield i
