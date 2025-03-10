from .templates import suggest
from .utils.use_template import use_template


def suggest_title(sources: dict[str, str]):
    return use_template(suggest, {"sources": sources})
