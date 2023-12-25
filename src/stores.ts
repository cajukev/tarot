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
    art: "",
    model: "gpt-3.5-turbo",
    analysis: "",
    summary: "",
    length: "medium",
    storyCardMeaning: "",
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
export const textSizeStore = persisted<number>('textSizeStore', 1);
export const guestTokenStore = persisted<number>('guestTokenStore', 9);