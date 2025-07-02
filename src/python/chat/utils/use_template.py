from promplate import Context, Template

from .llm import generate


async def use_template(template: Template, context: Context):
    async for i in generate(await template.arender(context)):
        assert isinstance(i, str)
        yield i
