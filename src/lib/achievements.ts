

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
    description: "Completed a reading with all three preset spreads",
    progress: [],
    progressType: "spreads",
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
    name: "Tarot joyer",
    description: "Spent 20 tokens",
    progress: 0,
    progressType: "number",
    experience: 50,
    completed: false
  }],
  ["25Tokens", {
    name: "Tarot enthousiast",
    description: "Spent 25 tokens",
    progress: 0,
    progressType: "number",
    experience: 50,
    completed: false
  }],
  ["30Tokens", {
    name: "Tarot expert",
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
  // ["PerfectionismEnergy", {
  //   name: "Perfectionist",
  //   description: "Manifest Perfectionism twice in a row",
  //   experience: 50,
  //   completed: false
  // }],
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
  "Tarot Beginner",
  "Tarot fan",
  "Tarot novice",
  "Tarot amateur",
  "Tarot joyer",
  "Tarot enthousiast",
  "Tarot expert",
  "Learning the Basics",
  "Let's try again...",
  "Beginnings of a pattern",
  // "PerfectionismEnergy",
  "Master of the Major Arcana"
]
