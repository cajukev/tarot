import { writable } from "svelte/store";

export const readingStore = writable<ReadingType>(
  {
    cards: [],
    conclusion: "",
    question: "",
    energy: "",
    setting: ""
  }
);
export const conclusionStore = writable<string>(undefined);
export const timeVariableStore = writable<number>(0);
export const settingStore = writable<string>(undefined);
export const flippedCardsStore = writable<boolean[]>(undefined);
export const flippedCardStore = writable<number>(-1);
