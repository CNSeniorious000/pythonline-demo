from .templates import gen_readme
from .utils.use_template import use_template


def generate_readme(sources: dict[str, str]):
    return use_template(gen_readme, {"sources": sources})
