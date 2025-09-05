import type { PageServerLoad } from "./$types";

import { loadWorkspace } from "$lib/cms/telegraph";

export const load = (async ({ params: { path } }) => {
  return await loadWorkspace(path);
}) satisfies PageServerLoad;
