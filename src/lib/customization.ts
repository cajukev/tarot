export type Cardback = {
  name: string
  pack?: string
  image: string
}

export type Art = {
  name: string,
  suffix: string
  decks: string[]
  card: string
}


export const cardbacks = [
  {
    name: "AITarot",
    image: "cardback"
  },
  {
    name: "Crystal Visions",
    image: "crystal_cardback",
    pack: "CrystalVisions"
  },
  {
    name: "Lunar Enlightenment",
    image: "moon_cardback",
    pack: "LunarEnlightenment"
  }
]

export const art: Art[] = [
  {
    name: "AITarot",
    decks: ["Major Arcana", "Suit of Cups", "Suit of Swords", "Suit of Wands", "Suit of Pentacles"],
    suffix: "",
    card: "The_Fool"
  },
  {
    name: "Scribble",
    decks: ["Major Arcana", "Suit of Cups", "Suit of Swords", "Suit of Wands", "Suit of Pentacles"],
    suffix: "scribble",
    card: "The_Fool"
  }
]