from os import getenv

from promplate.llm.openai import AsyncChatGenerate

generate = AsyncChatGenerate().bind(temperature=0, model=getenv("LLM_MODEL", "gpt-4o-mini"))
