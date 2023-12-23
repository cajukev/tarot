import { cards, type CollectionCard } from "$lib/cards";
import characters, { type Character } from "$lib/characters";
import type { ReadingSpreadType } from "$lib/readingSpreads";
import readingSpreads from "$lib/readingSpreads";
import { unlocks } from "$lib/unlocks";
import { getLengthInstruction } from "$lib/utils";
import type { RequestHandler } from "@sveltejs/kit";
import { LLMChain, SimpleSequentialChain } from "langchain/chains";
import { ChatOpenAI } from "langchain/chat_models/openai";
import { ChatPromptTemplate, SystemMessagePromptTemplate } from "langchain/prompts";
import { ChatCompletionRequestMessageRoleEnum } from "openai";


let apiKey = import.meta.env.VITE_OPENAI_SECRET_KEY;
const chatgpt3creative = new ChatOpenAI({ temperature: 1, modelName: "gpt-3.5-turbo-1106", verbose: true, streaming: true, openAIApiKey: apiKey, frequencyPenalty: 0.5, presencePenalty: 0.5 });
const chatgpt3logical = new ChatOpenAI({ temperature: 0, modelName: "gpt-3.5-turbo-1106", verbose: true, streaming: true, openAIApiKey: apiKey, frequencyPenalty: 0.5, presencePenalty: 0.5 });

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
        nextPosition: string;
        tokenCost: number;
    } = await request.json();

    // // Verify Used Packs
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

    // No spread because only 1 card

    let question = formData.reading.question || "No question";
    if (question.length > 100) {
        question = question.slice(0, 100);
    }

    let energy = formData.reading.energy || "";
    let drawnCard = formData.reading.cards[0] || cards.get("The Fool");
    let characterInput = formData.reading.character || "Brother Oak";
    let character = characters.get(characterInput);
    let conclusion = formData.reading.conclusion || "No conclusion";
    let summary = formData.reading.summary || "No summary";
    let length = formData.reading.length || "short";

    let model: ChatOpenAI;
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

    let summarySystem = `{empty}
From the READING - extract the name of each new card, and write a short phrase about the card's meaning in the context of the reading so far.
Return a JSON object where the key is the name of the card, and the value is the phrase for that card. Only include cards in the READING that are not in the SUMMARY.
SUMMARY: ${summary}.
READING: ${conclusion}.`

    const summaryTemplate = new ChatPromptTemplate({
        promptMessages: [
            SystemMessagePromptTemplate.fromTemplate(summarySystem)
        ],
        inputVariables: ["empty"]
    })


    // Summary verifier - check for duplicate cards with original summary & shorten if too long
    let summaryCheckerSystem = `Remove duplicate cards from SUMMARY + NEW SUMMARY. Return a JSON object where the key is the name of the card, and the value is the phrase for that card.
SUMMARY: ${summary}
NEW SUMMARY: {newSummary}`

    const summaryCheckerTemplate = new ChatPromptTemplate({
        promptMessages: [
            SystemMessagePromptTemplate.fromTemplate(summaryCheckerSystem)
        ],
        inputVariables: ["newSummary"]
    })

    // TODO: add a meaning parameter

    let readingSystem = `Ignore all instructions before this one. You print out only raw text.
You are ${character?.name} and must give the best Tarot reading given the following information.
` +
character?.description
+
`You continue the reading by pulling another card. This is the reading so far:
Question = ${question}
Summary of reading so far: ${summary} - {summary}

Drawn card: ${drawnCard.name} ${drawnCard.reversed ? "reversed" : ""}, "position": "${formData.nextPosition}" "meaning": "${drawnCard.reversed ? drawnCard.reversedMeaning : drawnCard.meaning}"
Use these meanings as a base of information to be interpreted with your dialect and writing style
(Unless writing a poem) follow this structure:
[
Start with a powerful statement about the message the drawn card shows (ie: "The seven of wands shows that you are in a position of power!")
Then, explain the meaning of the card in the position of the spread, and how it relates to the summary of the reading so far.
A card has 3 keywords as 'x, y and z' Only mention at most 1 of these per card. 
The reading must only contain 1 single card.
Conclude by reopening to the querent - beckoning them to pull another card.
]
Separate each paragraph with a line break
Answer in the same language as the question was asked
User Preferences, comply to demands:
'''
${profileData.data!.information}
'''
${lengthInstruction}`

    const readingTemplate = new ChatPromptTemplate({
        promptMessages: [
            SystemMessagePromptTemplate.fromTemplate(readingSystem)
        ],
        inputVariables: [
            "summary"
        ]
    })


    const summaryChain = new LLMChain({ llm: chatgpt3logical, prompt: summaryTemplate});

    const summaryCheckerChain = new LLMChain({ llm: chatgpt3logical, prompt: summaryCheckerTemplate});

    const readingChain = new LLMChain({ llm: model, prompt: readingTemplate});


    let newSummary = await summaryChain.call({empty: ""}).then((summaryResponse) => {
        console.log(summaryResponse.text);
        let summaryObj = JSON.parse(summaryResponse.text);
        let summaryString = "";
        for (const [key, value] of Object.entries(summaryObj)) {
            summaryString += `${key}: ${value}\n`;
        }
        return summaryString;
    })

    let newSummaryChecked = await summaryCheckerChain.call({newSummary: newSummary}).then((summaryCheckedResponse) => {
        console.log(summaryCheckedResponse.text);
        let summaryObj = JSON.parse(summaryCheckedResponse.text);
        let summaryString = "";
        for (const [key, value] of Object.entries(summaryObj)) {
            summaryString += `${key}: ${value}\n`;
        }
        return summaryString;
    })

    let newConclusion = await readingChain.call({summary: newSummaryChecked}).then((readingResponse) => {
        console.log(readingResponse);
        return readingResponse.text + "\n\n" + '...';

    })

    return new Response(
        JSON.stringify({
            message: "Success",
            summary: newSummaryChecked,
            conclusion: newConclusion
        }),
    );

    
    
};