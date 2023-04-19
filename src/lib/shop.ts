export type ShopItem = {
  name: string,
  amount: number,
  cost: number,
  description: string,
  type?: string,
}
export const shopItems: Map<string, ShopItem> = new Map([
  ["500Tokens", { name: "100 Tokens", "amount": 500, cost: 199, description: "200 Tokens" }],
  ["1000Tokens", { name: "1000 Tokens", "amount": 1000, cost: 399, description: "1000 Tokens" }],
  ["2000Tokens", { name: "2000 Tokens", "amount": 2000, cost: 799, description: "2000 Tokens" }],
])