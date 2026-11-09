from .templates import explain_error
from .utils.use_template import use_template


def explain(traceback: str, code: str):
    return use_template(explain_error, {"traceback": traceback, "code": code})
