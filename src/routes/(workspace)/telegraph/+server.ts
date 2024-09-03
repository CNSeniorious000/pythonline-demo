import type { RequestHandler } from "./$types";
import type { WorkspaceInfo } from "$lib/cms/types";

import { json } from "@sveltejs/kit";
import { serialize } from "$lib/cms/telegraph/utils";
import Telegraph from "telegra.ph";

const anonymousClient = new Telegraph("");

export const PUT: RequestHandler = async ({ request, url }) => {
  const info: WorkspaceInfo & { token?: string } = await request.json();
  info.author ||= "Anonymous";
  info.title ||= "Code Snippet";

  const { sources, title, author, token } = info;

  const client = new Telegraph(token ?? (await anonymousClient.createAccount(info.author)).access_token!);

  const content = serialize(sources);

  try {
    const { path } = await client.createPage(title, content, author, "https://py3.online");
    client.editPage(path, title, content, author, new URL(`/telegraph/${path}`, url).href).catch(console.error);
    return json({ path, token }, { status: 201 });
  }
  catch (e) {
    return json({ error: (e as Error).message }, { status: 400 });
  }
};
