

export type Achievement = {
  name: string;
  description: string;
  progress: any;
  experience: number;
  completed: boolean;
};

export const achievements: Map<string, Achievement> = new Map([
  ["Beginnings", {
    name: "Beginnings",
    description: "Completed a reading",
    progress: { },
    experience: 100,
    completed: false
  }],
  ["NewBeginnings", {
    name: "NewBeginnings",
    description: "Completed a reading with all three preset scenarios",
    progress: { progress: []},
    experience: 100,
    completed: false
  }],
  ["Perseverance", {
    name: "Perseverance",
    description: "Ask the same question twice in a row", 
    progress: { },
    experience: 100,
    completed: false
  }]
]
)