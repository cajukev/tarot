export type ShopItem = {
  key: string,
  name: string,
  cost: number,
  description: string,
  type: string,
  amount?: number,
  extra?: ShopExtra,
}
export type ShopExtra = {
  name: string,
  type?: string,
  amount?: number,
}

export const shopItems: Map<string, ShopItem> = new Map([
  ["200Essence", { key: "200Essence", name: "200 Essence", cost: 199, description: "200 Essence", amount: 200, type: "Essence" }],
  ["500Essence", {
    key: "500Essence", name: "500 Essence", amount: 500, cost: 499, description: "500 Essence", type: "Essence",
    extra: { name: "50 tokens", amount: 50, type: "Tokens" }
  }],
  ["1000Essence", { 
    key: "1000Essence", name: "1000 Essence", amount: 1000, cost: 999, description: "1000 Essence", type: "Essence",
    extra: { name: "100 tokens", amount: 150, type: "Tokens" }}],
  ["100tokens", {
    key: "100tokens", name: "100 Tokens", amount: 100, cost: 100, description: "100 Tokens", type: "Tokens",
  }],
  ["ReaderPack1", {
    key: "ReaderPack1", name: "Reader Pack 1", cost: 100, description: "Unlock Luna The Mystic", type: "ReaderPack",  
  }]
])
