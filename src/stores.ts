import type { CollectionDeck } from "$lib/cards";
import { writable } from "svelte/store";

export const readingStore = writable<ReadingType>(
  {
    cards: [],
    conclusion: "",
    question: "",
    energy: "",
    setting: "",
    character: "",
  }
);
export const conclusionStore = writable<string>(undefined);
export const timeVariableStore = writable<number>(0);
export const flippedCardsStore = writable<boolean[]>(undefined);
export const deviceStore = writable<{hasTouch: boolean, hasMouse: boolean}>({hasTouch: false, hasMouse: false});
export const collectionStore = writable<CollectionDeck[]>(undefined);
