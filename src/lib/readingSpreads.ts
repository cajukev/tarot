export type ReadingSpreadType = {
  key?: string;
  name: string;
  positions: string[];
  instructions: string[];
  placeholders?: string[];
};

export default new Map<string, ReadingSpreadType>([
  ["qa", {
    key: "qa",
    name: "Question & Answer",
    positions: [""],
    instructions: [""],
    placeholders: ["How can I...",
    "What should I...",
    "Where will...",
    "Who is influencing...",
    "Why am I feeling...",
    "What is the purpose of...",
    "How does this situation...",
    "What is the potential outcome if...",
    "Who should I...",
    "What is the underlying issue of...",
    "How can I improve...",
    "What is the best way to...",
    "What is the hidden factor in...",
    "Where should I...",
    "Why is this happening...",
    "What is the significance of...",
    "How can I overcome...",
    "What is the likely result of...",
    "Who is the key person in...",
    "What is the root cause of...",
    "How can I resolve...",
    "What is the impact of...",
    "Where is the...",
    "Why does...",
    "What is the meaning of...",
    "How can I utilize...",
    "What is the role of...",
    "Who is the...",
    "What is the potential of...",
    "How can I harness..."]
  }],
  ["pc", {
    key: "pc",
    name: "Pros & Cons",
    positions: ["Pros", "Cons"],
    instructions: ['', ''],
    placeholders: ["Could you reveal the pros and cons of...",
    "What might be the positive and negative outcomes if...",
    "Can you show the benefits and drawbacks of...",
    "Could you illustrate the advantages and disadvantages in...",
    "What are the potential rewards and risks associated with...",
    "Can you highlight the positive and negative aspects of...",
    "What might be the gains and losses from...",
    "Could you detail the strengths and weaknesses in...",
    "What are the potential upsides and downsides to...",
    "Can you outline the potential boons and banes of...",
    "What might be the positive and negative implications if...",
    "Could you explain the potential assets and liabilities of...",
    "What are the potential opportunities and pitfalls in...",
    "Can you clarify the potential pluses and minuses of...",
    "What might be the potential benefits and detriments when...",
    "Could you elaborate on the potential advantages and setbacks of...",
    "What are the potential rewards and hazards in...",
    "Can you provide insight into the potential upsides and drawbacks when...",
    "What might be the potential boons and drawbacks in...",
    "Could you shed light on the potential positives and negatives of...",
    "What are the potential assets and drawbacks when...",
    "Can you disclose the potential opportunities and risks in...",
    "What might be the potential pluses and minuses when...",
    "Could you unveil the potential pros and cons when...",
    "What are the potential benefits and disadvantages in...",
    "Can you reveal the potential advantages and hazards of...",
    "What might be the potential gains and pitfalls if...",
    "Could you detail the potential rewards and risks when...",
    "What are the potential upsides and downsides in..."]
  }],
  ["bme", {
    key: "bme",
    name: "Beginning, Middle, End",
    positions: ["Beginning", "Middle", "End"],
    instructions: [
      "What is the beginning of the situation?",
      "What is the middle of the situation?",
      "What is the end of the situation?"
    ],
    placeholders: ["What initiated...",
    "What is currently driving...",
    "What will conclude...",
    "What started...",
    "What is at the heart of...",
    "What will be the final outcome of...",
    "What sparked...",
    "What is the central theme of...",
    "What will be the ultimate result of...",
    "What was the origin of...",
    "What is the main factor in...",
    "What will be the end result of...",
    "What triggered...",
    "What is the core issue of...",
    "What will be the culmination of...",
    "What was the catalyst for...",
    "What is the pivotal point in...",
    "What will be the final impact of...",
    "What set in motion...",
    "What is the key element in...",
    "What will be the final resolution of...",
    "What was the initial cause of...",
    "What is the central conflict in...",
    "What will be the ultimate conclusion of...",
    "What was the root of...",
    "What is the main challenge in...",
    "What will be the end of...",
    "What was the inception of...",
    "What is the crux of...",
    "What will be the final stage of..."]
  }]
])