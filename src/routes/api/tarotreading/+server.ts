import { Configuration, OpenAIApi } from "openai-edge"
import { openaiEdge } from "$lib/openai";
import { ChatCompletionRequestMessageRoleEnum, type ChatCompletionRequestMessage } from "openai";
import readingSpreads, { type ReadingSpreadType } from "$lib/readingSpreads";
import type { RequestHandler } from "./$types";
import type { CollectionCard, CollectionDeck } from "$lib/cards";
import characters, { type Character } from "$lib/characters";
import { cards } from "$lib/cards";
import { unlocks } from "$lib/unlocks";

import { Client } from "langsmith";
import { LLMChain } from "langchain/chains";
import { ChatOpenAI } from "langchain/chat_models/openai";
import { LangChainTracer } from "langchain/callbacks";
import { ChatPromptTemplate, SystemMessagePromptTemplate } from "langchain/prompts";
import { getLengthInstruction } from "$lib/utils";

export const config = {
  runtime: 'edge',
};

let apiKey = import.meta.env.VITE_OPENAI_SECRET_KEY;
const chatgpt3creative = new ChatOpenAI({ temperature: 1, modelName: "gpt-3.5-turbo", verbose: true, streaming: true, openAIApiKey: apiKey, frequencyPenalty: 0.5, presencePenalty: 0.5 });
const chatgpt3logical = new ChatOpenAI({ temperature: 0, modelName: "gpt-3.5-turbo", verbose: true, streaming: true, openAIApiKey: apiKey, frequencyPenalty: 0.5, presencePenalty: 0.5 });

const chatgpt4creative = new ChatOpenAI({ temperature: 1, modelName: "gpt-4-1106-preview", verbose: true, streaming: true, openAIApiKey: apiKey, frequencyPenalty: 0.5, presencePenalty: 0.5 });
const chatgpt4logical = new ChatOpenAI({ temperature: 0, modelName: "gpt-4-1106-preview", verbose: true, streaming: true, openAIApiKey: apiKey, frequencyPenalty: 0.5, presencePenalty: 0.5 });


let hasAllUsedPacks = (usedCards: CollectionCard[], profile: any) => {
  let hasAll = true;

  let decks = Array.from(cards.values());
  let usedDecks = decks.filter((deck) => {
    return deck.cards.some((card) => {
      return usedCards.some((usedCard) => {
        return usedCard.name === card.name;
      })
    })
  })

  console.log(usedDecks);

  usedDecks.forEach((deck) => {
    if (deck.exp) {
      if (profile.experience < unlocks.get(deck.abbrv)!.exp) {
        hasAll = false;
      }
    }
  })
  return hasAll;
}

let hasReader = (character: Character, profile: any) => {
  return !character.pack ||
    character.pack === 'unlock' && profile.data.experience >= (unlocks.get(character.name)?.exp || 0) ||
    character.pack && profile.data.bought_items.includes(character.pack)
}

export const POST: RequestHandler = async ({ request, locals }) => {
  const formData: {
    reading: ReadingType;
    customSpread: ReadingSpreadType;
    tokenCost: number;
  } = await request.json();

  // Verify tokens
  const profileData = await locals.sb.from('Profile')
    .select('*')
    .eq('id', locals.session.user.id)
    .single()

  if (profileData.data!.tokens < formData.tokenCost) {
    return new Response(
      JSON.stringify({
        error: "Not enough tokens",
      }),
    );
  } else if (!hasReader(characters.get(formData.reading.character) as Character, profileData)) {
    return new Response(
      JSON.stringify({
        error: "Reader not unlocked",
      }),
    );
  } else {

    await locals.sb.from('Profile')
      .update({ tokens: profileData.data!.tokens - formData.tokenCost })
      .eq('id', locals.session.user.id)
      .single()
  }
  if (!hasAllUsedPacks(formData.reading.cards, profileData.data!)) {
    return new Response(
      JSON.stringify({
        error: "Cards not unlocked",
      }),
    );
  }


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
  let length = formData.reading.length || "short";
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

  let lengthInstruction = getLengthInstruction(length, formData.reading.cards.length)

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
  system += `Use these meanings as a base of information to be interpreted with your dialect and writing style
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
User Preferences, comply to demands:
'''
${profileData.data!.information}
'''
${lengthInstruction}`

  const tarotReadingTemplate = new ChatPromptTemplate({
    promptMessages: [
      SystemMessagePromptTemplate.fromTemplate(system)
    ],
    inputVariables: []
  })

  const client = new Client({
    apiUrl: "https://api.smith.langchain.com",
    apiKey: "ls__c6e70a8660ef488998362db5aab8b8a6",
  });
  
  const tracer = new LangChainTracer({
    projectName: "TarotReading",
    client,
  });

  const tarotReadingChain = new LLMChain({ llm: model, prompt: tarotReadingTemplate,  callbacks: [tracer] })

  const result = await tarotReadingChain.call({})

  console.log(result)

  return new Response(
    JSON.stringify({
      result: result.text,
    }),
  );
  
}