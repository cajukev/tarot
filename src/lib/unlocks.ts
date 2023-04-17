export type Unlock = {
  name: string,
  exp: number,
  description: string,
  type?: string,
}
export const unlocks: Map<string, Unlock> = new Map([
  ["Wands", { name: "Suit of Wands", exp: 50, description: "Enable the cards in your Collection", type: "card" }],
  ["Swords", { name: "Suit of Swords", exp: 50, description: "Enable the cards in your Collection", type: "card"}],
  ["pc", { name: "Pros & Cons", exp: 100, description: "You may now select this scenario", type: "scenario" }],
  ["Juniper", { name: "Juniper The Grounded", exp: 150, description: "You may now select this reader", type: "reader" }],
  ["Cups", { name: "Suit of Cups", exp: 200, description: "Enable the cards in your Collection", type: "card" }],
  ["Pentacles", { name: "Suit of Pentacles", exp: 200, description: "Enable the cards in your Collection", type: "card" }],
  ["ppf", { name: "Past, Present & Future", exp: 250, description: "You may now select this scenario", type: "scenario" }],
  ["custom", { name: "Custom Scenarios", exp: 300, description: "You may now create your own scenarios", type: "scenario" }],
  ["Talon", { name: "Talon The Enigmatic", exp: 300, description: "You may now select this reader", type: "reader" }],
  // ["cb1", { name: "Custom Back 1", exp: 450, }],
  // ["cb2", { name: "Custom Back 2", exp: 500, }],
  // ["cb3", { name: "Custom Back 3", exp: 550, }],
  // ["cb4", { name: "Custom Back 4", exp: 600, }],
  // ["cb5", { name: "Custom Back 5", exp: 650, }],
  // ["cb6", { name: "Custom Back 6", exp: 700, }],

])