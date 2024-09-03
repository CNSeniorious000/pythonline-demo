import type { RequestHandler } from "./$types";
import type { WorkspaceInfo } from "$lib/cms/types";

import { text } from "@sveltejs/kit";
import { serialize } from "$lib/cms/telegraph/utils";
import Telegraph from "telegra.ph";

export interface Payload extends WorkspaceInfo {
  token: string;
}

export const PUT: RequestHandler = async ({ request, params: { path } }) => {
  const { token, sources, title, author }: Payload = await request.json();

  const client = new Telegraph(token!);

  const content = serialize(sources);

  try {
    await client.editPage(path, title, content, author, request.url);
    return text("", { status: 204 });
  }
  catch (e) {
    return text((e as Error).message, { status: 400 });
  }
};
