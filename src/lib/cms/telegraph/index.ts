import type { Payload } from "../../../routes/(workspace)/telegraph/[path]/+server";
import type { WorkspaceInfo } from "../types";
import type { Page } from "telegra.ph/typings/telegraph";

import { deserialize } from "$lib/cms/telegraph/utils";
import { toastMarkdown } from "$lib/utils/toast";

type TelegraphResponse<T> = {
  ok: true;
  result: T;
} | {
  ok: false;
  error: string;
};

export async function forkWorkspace(info: WorkspaceInfo, token?: string) {
  const id = toastMarkdown("正在创建新的工作区", "loading");
  const res = await fetch("/telegraph", { method: "PUT", body: JSON.stringify({ ...info, token }) });

  if (res.ok) {
    const result: { path: string; token?: string } = await res.json();
    toastMarkdown(`成功创建 \`${result.path}\``, "success", id);
    return result;
  }
  const { error }: { error: string } = await res.json();
  toastMarkdown(`创建失败 \`${error}\``, "warning", id);
  throw new Error(error);
}

export async function updateWorkspace(payload: Payload) {
  const id = toastMarkdown("正在保存工作区", "loading");
  const res = await fetch("", { method: "PUT", body: JSON.stringify(payload) });
  if (!res.ok) {
    const error = await res.text();
    toastMarkdown(`保存失败 \`${error}\``, "warning", id);
    throw new Error(error);
  }
  toastMarkdown("保存成功", "success", id);
}

export async function loadWorkspace(path: string): Promise<WorkspaceInfo & { own: boolean }> {
  const url = `https://api.telegra.ph/getPage/${path}?return_content=true`;
  const res: TelegraphResponse<Page> = await fetch(url).then(r => r.json());
  if (!res.ok)
    throw new Error(res.error);
  const { content, title, author_name, can_edit } = res.result;
  const sources = deserialize(content!);
  return { sources, title, author: author_name!, own: can_edit! };
}
