import { writable } from "svelte/store";

export const currentConsolePush = writable<((source: string) => any) | null>(null);
