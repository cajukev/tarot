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
    extra: { name: "200 tokens", amount: 200, type: "Tokens" }
  }],
  ["1000Essence", { 
    key: "1000Essence", name: "1000 Essence", amount: 1000, cost: 999, description: "1000 Essence", type: "Essence",
    extra: { name: "500 tokens", amount: 500, type: "Tokens" }}],
  ["500tokens", {
    key: "500tokens", name: "500 Tokens", amount: 500, cost: 100, description: "500 Tokens", type: "Tokens",
  }],
  ["ReaderPack1", {
    key: "ReaderPack1", name: "Reader Pack 1", cost: 100, description: "Unlock Luna The Moongazer", type: "ReaderPack",  
  }],
  ["CrystalVisions", {
    key: "CrystalVisions", name: "Crystal Visions", cost: 100, description: "Unlock Jewel The VIbrant and Crystal Visions Cards and Cardback", type: "ReaderPack",
  }],
  ["LunarEnlightenment", {
    key: "LunarEnlightenment", name: "Lunar Enlightenment", cost: 100, description: "Unlock Luna The Moongazer and Lunar Enlightenment Cards and Cardback", type: "ReaderPack",
  }],
])