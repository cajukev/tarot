export type ReadingScenarioType = {
  key: string;
  name: string;
  positions: string[];
  instructions: string[];
  explanation: string;
  inputs: string[];
  example: string;
  drawExample?: string;
  conclusion?: boolean;
  cardTextLength: number;
};

export default new Map<string, ReadingScenarioType>([
//   ["bme", {
//     key: "bme",
//     name: "Beginning, Middle, End",
//     positions: ["Beginning", "Middle", "End"],
//     instructions: [
//       "Draw any card in any orientation and tell the aspects of it that relate to the beginning of the situation presented in the question.",
//       "Draw any card in any orientation and tell the aspects of it that relate to the middle of the situation presented in the question.",
//       "Draw any card in any orientation and tell the aspects of it that relate to the end of the situation presented in the question."
//     ],
//     explanation: "The reading is based off of the timeframe given in the question",
//     inputs: ["Question"],
//     example: `energy= "insightful",
// card= The Hermit
// reversed=true
// position= Beginning
// question= Should I work out tonight?
// The Hermit reversed in the beginning position`,
//     drawExample: `[{"name":"The High Priestess","reversed":false,"position":"Beginning"},
// {"name":"The Hermit","reversed":false,"position":"Middle"},
// {"name":"The Empress","reversed":true,"position":"End"}]`,
// cardTextLength: 20
//   }],
  ["qa", {
    key: "qa",
    name: "Question & Answer",
    positions: ["Answer"],
    instructions: ["none"],
    explanation: "A single card reading for the question",
    inputs: ["Question"],
    example: `energy= insightful
card= The Hermit
reversed= true
position= answer
question= Should I work out tonight?
The Hermit reversed tells me that... `,
drawExample: `[{ "name" : "The Sun" , "reversed" : false, "position" : "Answer" }]`,
cardTextLength: 60
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
  // {"name": "The Hermit", "reversed": true, "position": "Pros", "reading": "..."}`
  // }],
  ["pc", {
    key: "pc",
    name: "Pros & Cons",
    positions: ["Pros", "Cons"],
    instructions: ["Tell the aspects of the card that would encourage the client to take the action. Return a bullet point list in the format in the example <ul><li>Bullet point</li><li>Bullet Point<li><li>Bullet Point</ul>", "Tell the aspects of the card that would discourage the asker from taking the action. Return a bullet point list in the format in the example <ul><li>Bullet point</li><li>Bullet Point<li><li>Bullet Point</ul>"],
    explanation: "2 random cards are drawn, the first one symbolizes the reasons the client should take the action (pros), and the second one shows why the client should not take the action (cons)",
    inputs: ["Question"],
    example: `energy= abundance
position= cons
question= Should I eat pineapple on pizza?
Short paragraph about the cons of eating pineapple on pizza approx 20 words
<ul><li>Bullet point approx 10 words</li><li>Bullet point approx 10 words<li><li>Bullet point approx 10 words</ul>`,
    drawExample: `
[{ "name":"Five of Swords", "reversed":false, "position":"Pros" },
{ "name":"The Tower", "reversed":true, "position":"Cons" }]`,
    cardTextLength: 30
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
      "start with a short phrase predicting what the reading will unfold"
    ],
    explanation: "A standard 3-card reading for the past, present, and future",
    inputs: ["Question"],
    example: `energy= insightful
card= The Hermit
reversed= true
position= present
question= Should I work out tonight?
The Hermit reversed in the present position ... `,
    drawExample: `[{ "name" : "The High Priestess" , "reversed" : false, "position" : "Past" },
{ "name" : "The Hermit","reversed":false,"position":"Present"},
{"name":"The Empress","reversed":true,"position":"Future"}]`,
    conclusion: true,
    cardTextLength: 20
  }]
])