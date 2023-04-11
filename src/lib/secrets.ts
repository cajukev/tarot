type Secret = {
  name: string;
  description: string;
  type: string;
};

export const secrets: Map<string, Secret> = new Map([
  [
    "Svelte",{name: "Suit of Svelte",description: "Enable the cards in your collection",type: "card"},
  ]
]);