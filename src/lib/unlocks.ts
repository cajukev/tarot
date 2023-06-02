export type Unlock = {
  name: string,
  exp: number,
  description: string,
  type?: string,
}
export const unlocks: Map<string, Unlock> = new Map([
  ["pc", { name: "Pros & Cons", exp: 100, description: "You may now select this spread", type: "spread" }],
  ["Wands", { name: "Suit of Wands", exp: 150, description: "Enable the cards in your Collection", type: "card" }],
  ["Penelope", { name: "Penelope The Dreamer", exp: 200, description: "You may now select this reader", type: "reader" }],
  ["Swords", { name: "Suit of Swords", exp:250, description: "Enable the cards in your Collection", type: "card"}],
  ["bme", { name: "Beginning, Middle & End", exp: 300, description: "You may now select this spread", type: "spread" }],
  ["Cups", { name: "Suit of Cups", exp: 350, description: "Enable the cards in your Collection", type: "card" }],
  ["Talon", { name: "Talon The Enigmatic", exp: 400, description: "You may now select this reader", type: "reader" }],
  ["Pentacles", { name: "Suit of Pentacles", exp: 450, description: "Enable the cards in your Collection", type: "card" }],
  ["custom", { name: "Custom Spreads", exp: 500, description: "You may now create your own spreads", type: "spread" }],
  // ["cb1", { name: "Custom Back 1", exp: 450, }],
  // ["cb2", { name: "Custom Back 2", exp: 500, }],
  // ["cb3", { name: "Custom Back 3", exp: 550, }],
  // ["cb4", { name: "Custom Back 4", exp: 600, }],
  // ["cb5", { name: "Custom Back 5", exp: 650, }],
  // ["cb6", { name: "Custom Back 6", exp: 700, }],

])