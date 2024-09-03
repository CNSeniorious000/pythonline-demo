import type { WorkspaceInfo } from "../types";
import type { Page } from "telegra.ph/typings/telegraph";

import { deserialize } from "$lib/cms/telegraph/utils";

type TelegraphResponse<T> = {
  ok: true;
  result: T;
} | {
  ok: false;
  error: string;
};

export async function saveWorkspace(info: WorkspaceInfo): Promise<{ path: string; token: string }> {
  return await fetch("/telegraph", { method: "PUT", body: JSON.stringify(info) }).then(res => res.json());
}

export async function loadWorkspace(path: string): Promise<WorkspaceInfo> {
  const url = `https://api.telegra.ph/getPage/${path}?return_content=true`;
  const res: TelegraphResponse<Page> = await fetch(url).then(r => r.json());
  if (!res.ok)
    throw new Error(res.error);
  const { content, title, author_name } = res.result;
  const sources = deserialize(content!);
  return { sources, title, author: author_name! };
}
