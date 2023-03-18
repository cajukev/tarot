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
export const cardFlipStore = writable<number>(-1);
export const deviceStore = writable<{hasTouch: boolean, hasMouse: boolean}>({hasTouch: false, hasMouse: false});
export const flipLockStore = writable<boolean>(false);