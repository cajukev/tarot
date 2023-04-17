

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
  ["5Readings", {
    name: "Tarot novice",
    description: "Completed 5 readings",
    progress: 0,
    progressType: "number",
    experience: 50,
    completed: false
  }],
  ["10Readings", {
    name: "Tarot amateur",
    description: "Completed 10 readings",
    progress: 0,
    progressType: "number",
    experience: 50,
    completed: false
  }],
  ["15Readings", {
    name: "Tarot fan",
    description: "Completed 15 readings",
    progress: 0,
    progressType: "number",
    experience: 50,
    completed: false
  }],
  ["20Readings", {
    name: "Tarot enthusiast",
    description: "Completed 20 readings",
    progress: 0,
    progressType: "number",
    experience: 50,
    completed: false
  }],
  ["30Readings", {
    name: "Tarot enjoyer",
    description: "Completed 30 readings",
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
    description: "Manifest Perfectionism",
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
  }],

]
)

export const achievementsOrder = [
  "FirstCompletedReading",
  "ReadingWith3Preset",
  "SameQuestion",
  "10Readings",
  "20Readings",
  "30Readings",
  "SameEnergy",
  "PerfectionismEnergy",
  "AllMACards"
]
