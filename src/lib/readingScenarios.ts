type ReadingScenario = {
  key: string;
  name: string;
  positions: string[];
  instructions: string[];
  explanation: string;
  inputs: string[];
  example: string;
};

export default new Map<string, ReadingScenario>([
  ['bme', {
    key: 'bme',
    name: "Beginning, Middle, End",
    positions: ["Beginning", "Middle", "End"],
    instructions: [
      "Draw any card in any orientation and tell the aspects of it that relate to the beginning of the situation presented in the question.",
      "Draw any card in any orientation and tell the aspects of it that relate to the middle of the situation presented in the question.",
      "Draw any card in any orientation and tell the aspects of it that relate to the end of the situation presented in the question."
    ],
    explanation: "The reading is based off of the timeframe given in the question",
    inputs: ["Question"],
    example: `"Draw a {random} card and intuit what can go right from it
  energy= "insightful"
  position= "present"
  question= Should I work out tonight?
  {"title": "The Hermit", "reversed": true, "position": "Pros", "reading": "The Hermit reversed in the present position suggests that working out tonight may provide you with the opportunity for self-reflection and introspection. It may give you the insight needed to make positive changes in your fitness routine."}`
  }],
  ['ppf', {
    key: 'ppf',
    name: "Past, Present, Future",
    positions: ["Past", "Present", "Future"],
    instructions: [
      "Draw any card in any orientation and tell the aspects of it that relate to the past of the situation presented in the question.",
      "Draw any card in any orientation and tell the aspects of it that relate to the present of the situation presented in the question.",
      "Draw any card in any orientation and tell the aspects of it that relate to the future of the situation presented in the question."
    ],
    explanation: "A standard 3-card reading for the past, present, and future",
    inputs: ["Question"],
    example: `"Draw any card in any orientation and tell the aspects of it that relate to the present of the situation presented in the question."
  energy= "insightful"
  position= "Present"
  question= Should I work out tonight?
  {"title": "The Hermit", "reversed": true, "position": "Past", "reading": "The Hermit reversed in the present position suggests that working out tonight may provide you with the opportunity for self-reflection and introspection. It may give you the insight needed to make positive changes in your fitness routine."}`
  }],
  ['1c', {
    key: '1c',
    name: "One Card Reading",
    positions: ["Answer"],
    instructions: ["What is the answer to the question?"],
    explanation: "A single card reading for the question",
    inputs: ["Question"],
    example: `"Draw any card in any orientation and answer the question using that card
  energy= "insightful"
  position= "answer"
  question= Should I work out tonight?
  {"title": "The Hermit", "reversed": true, "position": "Answer", "reading": "The Hermit reversed that working out tonight may provide you with the opportunity for self-reflection and introspection. It may give you the insight needed to make positive changes in your fitness routine."}`
  }],
  ['2c-options', {
    key: '2c-options',
    name: "2 Options",
    positions: ["Option 1", "Option 2"],
    instructions: ["What is the first option?", "What is the second option?"],
    explanation: "A two card reading for the question with two options",
    inputs: ["Option 1", "Option 2"],
    example: `"Draw a {random} card and intuit what can go right from it
  energy= "insightful"
  position= "present"
  question= Should I work out tonight?
  {"title": "The Hermit", "reversed": true, "position": "Pros", "reading": "The Hermit reversed in the present position suggests that working out tonight may provide you with the opportunity for self-reflection and introspection. It may give you the insight needed to make positive changes in your fitness routine."}`
  }],
  ['2c-pc', {
    key: '2c-pc',
    name: "Pros & Cons",
    positions: ["Pros", "Cons"],
    instructions: ["Draw any card in any orientation and tell the aspects of it that would encourage the asker from taking the action", "Draw any card in any orientation and tell the aspects of it that would discourage the asker from taking the action"],
    explanation: "2 random cards are drawn, the first one shows the pros and the second one shows the cons",
    inputs: ["Question"],
    example: `Draw any card in any orientation and tell the aspects of it that would discourage the asker from taking the action
The drawn card should be independant from the {position}, but linked to the {energy}.
energy= "abundance"
position= "cons"
question= "Should I eat pineapple on pizza?"
title": "Justice", "reversed": true, "position": "Cons", "reading": "<ul> <li>indulging in your cravings could lead to imbalance and negative consequences</li>
<li>Eating pineapple on pizza may not align with your values or beliefs, and could result in a sense of guilt or regret afterwards.</li>"}`
  }]
])