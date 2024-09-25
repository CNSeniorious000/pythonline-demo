import { version } from "@promplate/pyodide-bootstrap/version";
import * as env from "$env/static/public";

// eslint-disable-next-line ts/ban-ts-comment
// @ts-ignore
export const indexURL = env.PUBLIC_PYODIDE_INDEX_URL ?? (import.meta.env.PROD ? `/pyodide/v${version}/` : `https://cdn.jsdelivr.net/pyodide/v${version}/full/`);

export const preloadPackages = ["micropip", "pure-eval"];
