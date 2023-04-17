

export type Achievement = {
  name: string;
  description: string;
  progress?: any;
  progressType?: string;
  experience: number;
  completed: boolean;
};

export const achievements: Map<string, Achievement> = new Map([
  ["FirstCompletedReading", {
    name: "Tarot Beginner",
    description: "Completed a reading",
    experience: 50,
    completed: false
  }],
  ["ReadingWith3Preset", {
    name: "Learning the Basics",
    description: "Completed a reading with all three preset scenarios",
    progress: [],
    progressType: "scenarios",
    experience: 50,
    completed: false
  }],
  ["SameQuestion", {
    name: "Let's try again...",
    description: "Ask the same question twice in a row", 
    experience: 50,
    completed: false
  }],
  ["5Tokens", {
    name: "Tarot fan",
    description: "Spent 5 tokens",
    progress: 0,
    progressType: "number",
    experience: 50,
    completed: false
  }],
  ["10Tokens", {
    name: "Tarot novice",
    description: "Spent 10 tokens",
    progress: 0,
    progressType: "number",
    experience: 50,
    completed: false
  }],
  ["15Tokens", {
    name: "Tarot amateur",
    description: "Spent 15 tokens",
    progress: 0,
    progressType: "number",
    experience: 50,
    completed: false
  }],
  ["20Tokens", {
    name: "Tarot enthusiast",
    description: "Spent 20 tokens",
    progress: 0,
    progressType: "number",
    experience: 50,
    completed: false
  }],
  ["30Tokens", {
    name: "Tarot reader",
    description: "Spent 30 tokens",
    progress: 0,
    progressType: "number",
    experience: 50,
    completed: false
  }],
  ["SameEnergy", {
    name: "Beginnings of a pattern",
    description: "Manifest the same energy twice in a row",
    experience: 50,
    completed: false
  }],
  ["PerfectionismEnergy", {
    name: "Perfectionist",
    description: "Manifest Perfectionism twice in a row",
    experience: 50,
    completed: false
  }],
  ["AllMACards", {
    name: "Master of the Major Arcana",
    description: "Manifest all Major Arcana cards",
    progress: [],
    progressType: "cards",
    experience: 50,
    completed: false
  }]

]
)

export const achievementsOrder = [
  "FirstCompletedReading",
  "ReadingWith3Preset",
  "SameQuestion",
  "5Tokens",
  "10Tokens",
  "15Tokens",
  "20Tokens",
  "25Tokens",
  "30Tokens",
  "SameEnergy",
  "PerfectionismEnergy",
  "AllMACards"
]
