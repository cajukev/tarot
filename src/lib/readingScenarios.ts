export type ReadingScenarioType = {
  key?: string;
  name: string;
  positions: string[];
  instructions: string[];
};

export default new Map<string, ReadingScenarioType>([
  ["qa", {
    key: "qa",
    name: "Question & Answer",
    positions: [""],
    instructions: [""]
  }],
  ["pc", {
    key: "pc",
    name: "Pros & Cons",
    positions: ["Pros", "Cons"],
    instructions: ["Write a bullet point list of the positives of the situation", "Write a bullet point list of the negatives of the situation"]
  }],
  ["ppf", {
    key: "ppf",
    name: "Past, Present & Future",
    positions: ["Past", "Present", "Future"],
    instructions: [
      // "Draw any card in any orientation and tell the aspects of it that relate to the past of the situation presented in the question.",
      // "Draw any card in any orientation and tell the aspects of it that relate to the present of the situation presented in the question.",
      // "Draw any card in any orientation and tell the aspects of it that relate to the future of the situation presented in the question."
      "none",
      "none",
      "start with a short phrase telling the story at a glance"
    ]
  }]
])