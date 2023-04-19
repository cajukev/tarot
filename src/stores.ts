import type { Achievement } from "$lib/achievements";
import type { CollectionDeck } from "$lib/cards";
import type { ReadingScenarioType } from "$lib/readingScenarios";
import { writable } from "svelte/store";

export const readingStore = writable<ReadingType>(
  {
    cards: [],
    conclusion: "",
    question: "",
    energy: "",
    setting: "",
    character: ""
  }
);
export const conclusionStore = writable<string>(undefined);
export const timeVariableStore = writable<number>(0);
export const flippedCardsStore = writable<boolean[]>(undefined);
export const deviceStore = writable<{hasTouch: boolean, hasMouse: boolean}>({hasTouch: false, hasMouse: false});
export const collectionStore = writable<CollectionDeck[]>(undefined);
export const menuStateStore = writable<{value: number, change: boolean}>({value:0, change:false});
export const customScenariosStore = writable<ReadingScenarioType[]>([]);
export const achievementsStore = writable<{action: string, value: any}>();
