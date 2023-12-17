import { Configuration, OpenAIApi } from "openai-edge"
import { openaiEdge } from "$lib/openai";
import { ChatCompletionRequestMessageRoleEnum, type ChatCompletionRequestMessage } from "openai";
import readingSpreads, { type ReadingSpreadType } from "$lib/readingSpreads";
import type { RequestHandler } from "./$types";
import type { CollectionCard, CollectionDeck } from "$lib/cards";
import characters, { type Character } from "$lib/characters";
import { cards } from "$lib/cards";
import { unlocks } from "$lib/unlocks";
import { ChatPromptTemplate, SystemMessagePromptTemplate } from "langchain/prompts";
import { ChatOpenAI } from "langchain/chat_models/openai";
import { LLMChain } from "langchain/chains";

export const config = {
  runtime: 'edge',
};

let apiKey = import.meta.env.VITE_OPENAI_SECRET_KEY;
const chatgpt3creative = new ChatOpenAI({ temperature: 1, modelName: "gpt-3.5-turbo", verbose: true, streaming: true, openAIApiKey: apiKey, frequencyPenalty: 0.5, presencePenalty: 0.5 });
const chatgpt3logical = new ChatOpenAI({ temperature: 0, modelName: "gpt-3.5-turbo", verbose: true, streaming: true, openAIApiKey: apiKey, frequencyPenalty: 0.5, presencePenalty: 0.5 });

const chatgpt4creative = new ChatOpenAI({ temperature: 1, modelName: "gpt-4-1106-preview", verbose: true, streaming: true, openAIApiKey: apiKey, frequencyPenalty: 0.5, presencePenalty: 0.5 });
const chatgpt4logical = new ChatOpenAI({ temperature: 0, modelName: "gpt-4-1106-preview", verbose: true, streaming: true, openAIApiKey: apiKey, frequencyPenalty: 0.5, presencePenalty: 0.5 });


export const POST: RequestHandler = async ({ request, locals }) => {
  const formData: {
    reading: ReadingType;
    customSpread: ReadingSpreadType;
    tokenCost: number;
  } = await request.json();

  let setting = formData.reading.setting || "ppf";
  let spread: ReadingSpreadType;
  if (formData.customSpread) {
    spread = formData.customSpread;
  } else {
    spread = readingSpreads.get(setting)!;
  }
  let question = formData.reading.question || "No question";
  if (question.length > 100) {
    question = question.slice(0, 100);
  }
  let energy = formData.reading.energy || "";
  let drawnCards = formData.reading.cards || [];
  let characterInput = formData.reading.character || "Brother Oak";
  let character = characters.get(characterInput);
  let model: ChatOpenAI;
  let multiplier = formData.reading.multiplier || 1;
  switch (formData.reading.model) {
    case 'gpt-3.5-turbo':
      model = chatgpt3creative;
      break;
    case 'gpt-4':
      model = chatgpt4creative;
      break;
    default:
      model = chatgpt3creative;
  }


  let system = `Ignore all instructions before this one. You print out only raw text.
You are ${characterInput} and must give the best Tarot reading given the following information.
` +
    character?.description
    //     +
    //     `Expressions: ${character?.expressions?.sort(() => Math.random() - 0.5).slice(0, 5).join(`
    // `)}
    // `
    +
    `Spread: ${spread.name} - Do not mention the spread name in the reading
Question = ${question}
Drawn card(s):`
  drawnCards.forEach((card, i) => {
    system += `
  ${card.name} ${card.reversed ? "reversed" : ""}, "position": "${spread.positions[i] || "Answer"}", special instruction: ${spread.instructions[i]}, "meaning": "${card.reversed ? card.reversedMeaning : card.meaning}`
  })
  system += `
  se these meanings as a base of information to be interpreted with your dialect and writing style
(Unless writing a poem) follow this structure:
[
Minimal greeting (optional)
Start with a powerful statement about the message the cards show (ie: "You are going to have a great day today!")
Answer using the cards in the order they were drawn naming them and connect them once all the associated cards have been explained. Each card has 3 keywords as 'x, y and z' Only mention at most 1 of these per card. 
The reading must only contain ${spread.positions.length} cards
Conclude by reopening to the querent - beckoning them to pull another card.
]
Separate each paragraph with a line break
Answer in the same language as the question was asked
Maximum ${(80 * drawnCards.length + 80)*multiplier} words OR LESS depending on user preference. Do not ever return word count`

  const messages = [
    { role: ChatCompletionRequestMessageRoleEnum.System, 'content': system },
  ]
  console.log('messages', messages[0].content)

  const tarotReadingTemplate = new ChatPromptTemplate({
    promptMessages: [
      SystemMessagePromptTemplate.fromTemplate(system)
    ],
    inputVariables: []
  })



  const tarotReadingChain = new LLMChain({ llm: model, prompt: tarotReadingTemplate })

  const reading = await tarotReadingChain.call({})

  const readingText = reading.text

  return new Response(JSON.stringify({ result: readingText}))
}