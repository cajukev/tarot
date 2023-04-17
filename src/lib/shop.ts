export type ShopItem = {
  name: string,
  amount: number,
  cost: number,
  description: string,
  type?: string,
}
export const shopItems: Map<string, ShopItem> = new Map([
  ["100Tokens", { name: "100 Tokens", "amount": 200, cost: 199, description: "200 Tokens" }],
  ["500Tokens", { name: "500 Tokens", "amount": 500, cost: 399, description: "500 Tokens" }],
  ["1000Tokens", { name: "1000 Tokens", "amount": 1000, cost: 799, description: "1000 Tokens" }],
])