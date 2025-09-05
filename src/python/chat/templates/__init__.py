from pathlib import Path

from promplate import Template

here = Path(__file__).parent

explain_error = Template.read(here / "explain-error.j2")
groundings = Template.read(here / "groundings.j2")
sources = Template.read(here / "sources.j2")

components = {"ExplainError": explain_error, "Groundings": groundings, "Sources": sources}

suggest = Template.read(here / "suggest.j2")
gen_readme = Template.read(here / "gen-readme.j2")

explain_error.context = suggest.context = gen_readme.context = components
