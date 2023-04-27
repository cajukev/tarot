import type { Achievement } from "$lib/achievements";
import type { CollectionDeck } from "$lib/cards";
import type { ReadingSpreadType } from "$lib/readingSpreads";
import { writable } from "svelte/store";
import { persisted } from "svelte-local-storage-store";

export const readingStore = writable<ReadingType>(
  {
    cards: [],
    conclusion: "",
    question: "",
    energy: "",
    setting: "",
    character: "",
    cardback: "cardback",
  }
);
export const conclusionStore = writable<string>(undefined);
export const timeVariableStore = writable<number>(0);
export const flippedCardsStore = writable<boolean[]>(undefined);
export const deviceStore = writable<{hasTouch: boolean, hasMouse: boolean}>({hasTouch: false, hasMouse: false});
export const collectionStore = persisted<CollectionDeck[]>('collectionStore', []);
export const menuStateStore = writable<{value: number, change: boolean}>({value:0, change:false});
export const customSpreadsStore = writable<ReadingSpreadType[]>([]);
export const achievementsStore = writable<{action: string, value: any}>();
