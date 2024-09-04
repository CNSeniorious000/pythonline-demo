import type { WorkspaceInfo } from "$lib/cms/types";

import { persisted } from "svelte-persisted-store";

export const telegraphToken = persisted<string | undefined>("telegraph-token", undefined);

export type WorkspaceMetadata = Omit<WorkspaceInfo, "sources"> & { own: boolean };

export const recents = persisted<{ [path: string]: WorkspaceMetadata }>("projects", {});
