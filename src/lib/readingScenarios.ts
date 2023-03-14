type ReadingScenario = {
  key: string;
  name: string;
  positions: string[];
  instructions: string[];
  explanation: string;
  inputs: string[];
  example: string;
  drawExample?: string;
};

export default new Map<string, ReadingScenario>([
  ["bme", {
    key: "bme",
    name: "Beginning, Middle, End",
    positions: ["Beginning", "Middle", "End"],
    instructions: [
      "Draw any card in any orientation and tell the aspects of it that relate to the beginning of the situation presented in the question.",
      "Draw any card in any orientation and tell the aspects of it that relate to the middle of the situation presented in the question.",
      "Draw any card in any orientation and tell the aspects of it that relate to the end of the situation presented in the question."
    ],
    explanation: "The reading is based off of the timeframe given in the question",
    inputs: ["Question"],
    example: `energy= "insightful",
card= The Hermit
reversed=true
position= Beginning
question= Should I work out tonight?
{"reading": "The Hermit reversed in the beginning position ... .. "}`,
    drawExample: `[{"title":"The High Priestess","reversed":false,"position":"Beginning"},
{"title":"The Hermit","reversed":false,"position":"Middle"},
{"title":"The Empress","reversed":true,"position":"End"}]`
  }],
  ["ppf", {
    key: "ppf",
    name: "Past, Present, Future",
    positions: ["Past", "Present", "Future"],
    instructions: [
      // "Draw any card in any orientation and tell the aspects of it that relate to the past of the situation presented in the question.",
      // "Draw any card in any orientation and tell the aspects of it that relate to the present of the situation presented in the question.",
      // "Draw any card in any orientation and tell the aspects of it that relate to the future of the situation presented in the question."
      "Tell the aspects of the card that relate to the past of the situation presented in the question.",
      "Tell the aspects of the card that relate to the present of the situation presented in the question.",
      "Tell the aspects of the card that relate to the future of the situation presented in the question."
    ],
    explanation: "A standard 3-card reading for the past, present, and future",
    inputs: ["Question"],
    example: `energy= insightful
card= The Hermit
reversed= true
position= present
question= Should I work out tonight?
{"reading": "The Hermit reversed in the present position ... .. "}`,
    drawExample: `[{"title":"The High Priestess","reversed":false,"position":"Past"},
{"title":"The Hermit","reversed":false,"position":"Present"},
{"title":"The Empress","reversed":true,"position":"Future"}]`
  }],
  ["1c", {
    key: "1c",
    name: "One Card Reading",
    positions: ["Answer"],
    instructions: ["What is the answer to the question?"],
    explanation: "A single card reading for the question",
    inputs: ["Question"],
    example: `energy= insightful
card= The Hermit
reversed= true
position= answer
question= Should I work out tonight?
{"reading": "The Hermit reversed tells me that ... ."}`,
drawExample: `[{"title":"The Sun","reversed":false,"position":"Answer"}]`
  }],
  // ["2c-options", {
  //   key: "2c-options",
  //   name: "2 Options",
  //   positions: ["Option 1", "Option 2"],
  //   instructions: ["What is the first option?", "What is the second option?"],
  //   explanation: "A two card reading for the question with two options",
  //   inputs: ["Option 1", "Option 2"],
  //   example: `energy= "insightful"
  // position= "present"
  // question= Should I work out tonight?
  // {"title": "The Hermit", "reversed": true, "position": "Pros", "reading": "..."}`
  // }],
  ["2c-pc", {
    key: "2c-pc",
    name: "Pros & Cons",
    positions: ["Pros", "Cons"],
    instructions: ["Tell the aspects of the card that would encourage the asker from taking the action. Return a bullet point list in the format in the example", "Tell the aspects of the card that would discourage the asker from taking the action. Return a bullet point list in the format in the example"],
    explanation: "2 random cards are drawn, the first one shows the pros and the second one shows the cons",
    inputs: ["Question"],
    example: `energy= abundance
position= cons
question= Should I eat pineapple on pizza?
{"reading": "<ul><li>... . </li><li>... . <li><li>... . </ul>"}`,
    drawExample: `
    [{"title":"The Sun","reversed":false,"position":"Pros"},
{"title":"The Tower","reversed":true,"position":"Cons"}]`
  }]
])