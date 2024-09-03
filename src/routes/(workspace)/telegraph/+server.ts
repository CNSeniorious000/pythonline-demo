import type { RequestHandler } from "./$types";
import type { WorkspaceInfo } from "$lib/cms/types";

import { json } from "@sveltejs/kit";
import { serialize } from "$lib/cms/telegraph/utils";
import Telegraph from "telegra.ph";

const anonymousClient = new Telegraph("");

export const PUT: RequestHandler = async ({ request, url }) => {
  const { sources, title, author }: WorkspaceInfo = await request.json();

  const name = author || "Anonymous"; ;
  const pageTitle = title || "Code Snippet";

  const { access_token: token } = await anonymousClient.createAccount(name);
  const client = new Telegraph(token!);

  const content = serialize(sources);

  try {
    const { path } = await client.createPage(pageTitle, content, name, "https://py3.online");
    client.editPage(path, pageTitle, content, name, new URL(`/telegraph/${path}`, url).href).catch(console.error);
    return json({ path, token }, { status: 201 });
  }
  catch (e) {
    return json({ error: (e as Error).message }, { status: 400 });
  }
};
