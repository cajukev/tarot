import { image } from "@fern-api/openai/api"

export type ShopItem = {
  key: string,
  name: string,
  cost: number,
  description: string,
  type: string,
  stripeDescription?: string,
  amount?: number,
  extra?: ShopExtra,
}
export type ShopExtra = {
  name: string,
  type?: string,
  amount?: number,
}

export const shopItems: Map<string, ShopItem> = new Map([
  ["200Essence", { key: "200Essence", name: "200 Essence", cost: 199, description: "", amount: 200, type: "Essence" }],
  ["500Essence", {
    key: "500Essence", name: "500 Essence", amount: 500, cost: 499, stripeDescription: "+200 bonus tokens" , description: "", type: "Essence",
    extra: { name: "200 tokens", amount: 200, type: "Tokens" }
  }],
  ["1000Essence", { 
    key: "1000Essence", name: "1000 Essence", amount: 1000, cost: 999, stripeDescription: "+500 bonus tokens", description: "", type: "Essence",
    extra: { name: "500 tokens", amount: 500, type: "Tokens" }}],
  ["750tokens", {
    key: "500tokens", name: "500 Tokens", amount: 500, cost: 100, description: "", type: "Tokens",
  }],
  ["CrystalVisions", {
    key: "CrystalVisions", name: "Crystal Visions", cost: 200, description: "Unlock Jewel The Vibrant and Crystal Visions Cards and Cardback", type: "ReaderPack",
  }],
  ["LunarEnlightenment", {
    key: "LunarEnlightenment", name: "Lunar Enlightenment", cost: 200, description: "Unlock Luna The Moongazer and Lunar Enlightenment Cards and Cardback", type: "ReaderPack",
  }],
  ["Zephyr", {
    key: "Zephyr", name: "Zephyr The Whimsical", cost: 100, description: "Unlock Zephyr The Whimsical", type: "Reader",
  }],
  ["Ignatio", {
    key: "Ignatio", name: "Ignatio The Flame Seer", cost: 100, description: "Unlock Ignatio The Flame Seer", type: "Reader",
  }],
  ["Seraphina", {
    key: "Seraphina", name: "Seraphina The Siren Poet", cost: 100, description: "Unlock Seraphina The Siren Poet", type: "Reader",
  }],
  ["Gaia", {
    key: "Gaia", name: "Gaia The Grounded", cost: 100, description: "Unlock Gaia The Grounded", type: "Reader",
  }],
  ["Jack", {
    key: "Jack", name: "Jack The Dealer", cost: 100, description: "Unlock Jack The Dealer", type: "Reader",
  }],
  ["Amora", {
    key: "Amora", name: "Amora The Love Oracle", cost: 100, description: "Unlock Amora The Love Oracle", type: "Reader",
  }],
  ["Wilbur", {
    key: "Wilbur", name: "Wilbur The Storyteller", cost: 100, description: "Unlock Wilbur The Storyteller", type: "Reader",  
  }],
])