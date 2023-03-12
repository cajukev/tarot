import { writable } from "svelte/store";

export const readingStore = writable<ReadingType>(undefined);
export const conclusionStore = writable<string>(undefined);
export const timeVariableStore = writable<number>(0);