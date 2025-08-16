import { writable } from "svelte/store";

export const sources = writable<Record<string, string>>({});

export const showEditor = writable(true);
