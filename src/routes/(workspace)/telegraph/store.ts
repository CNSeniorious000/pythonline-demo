import { persisted } from "svelte-persisted-store";

export const telegraphToken = persisted<string | undefined>("telegraph-token", undefined);
