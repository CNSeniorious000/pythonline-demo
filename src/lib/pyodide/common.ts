import { version } from "@promplate/pyodide-bootstrap/version";
import * as env from "$env/static/public";

// eslint-disable-next-line ts/ban-ts-comment
// @ts-ignore
export const indexURL = (env.PUBLIC_PYODIDE_INDEX_URL ?? (import.meta.env.PROD ? "/pyodide/v{}/" : "https://cdn.jsdelivr.net/pyodide/v{}/full/")).replace("{}", version);

export const preloadPackages = ["micropip", "pure-eval"];
