import type { ConsoleAPI } from "$py/console/console";

import { writable } from "svelte/store";

export const currentConsole = writable<ConsoleAPI | null>(null);
export const currentConsolePush = writable<((source: string) => any) | null>(null);
