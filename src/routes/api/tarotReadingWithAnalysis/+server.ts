import characters from "$lib/characters";
import type { ReadingSpreadType } from "$lib/readingSpreads";
import readingSpreads from "$lib/readingSpreads";
import type { RequestHandler } from "@sveltejs/kit";
import { LLMChain } from "langchain/chains";
import { ChatOpenAI } from "langchain/chat_models/openai";
import { ChatPromptTemplate, SystemMessagePromptTemplate } from "langchain/prompts";

export const config = {
    runtime: 'edge',
  };

let apiKey = import.meta.env.VITE_OPENAI_SECRET_KEY;
const chatgpt3creative = new ChatOpenAI({ temperature: 1, modelName: "gpt-3.5-turbo", verbose: true, streaming: true, openAIApiKey: apiKey, frequencyPenalty: 0.5, presencePenalty: 0.5 });
const chatgpt3logical = new ChatOpenAI({ temperature: 0, modelName: "gpt-3.5-turbo", verbose: true, streaming: true, openAIApiKey: apiKey, frequencyPenalty: 0.5, presencePenalty: 0.5 });

const chatgpt4creative = new ChatOpenAI({ temperature: 1, modelName: "gpt-4-1106-preview", verbose: true, streaming: true, openAIApiKey: apiKey, frequencyPenalty: 0.5, presencePenalty: 0.5 });
const chatgpt4logical = new ChatOpenAI({ temperature: 0, modelName: "gpt-4-1106-preview", verbose: true, streaming: true, openAIApiKey: apiKey, frequencyPenalty: 0.5, presencePenalty: 0.5 });

export const POST: RequestHandler = async ({request, locals}) => {

    const formData: {
        readingStore: ReadingType;
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
    }

    await locals.sb.from('Profile')
        .update({ tokens: profileData.data!.tokens - formData.tokenCost })
        .eq('id', locals.session.user.id)
        .single()

    let setting = formData.readingStore.setting || "ppf";
    let spread: ReadingSpreadType;
    if(formData.customSpread){
        spread = formData.customSpread;
    }else{
        spread = readingSpreads.get(setting)!;
    }
    
    let cards = formData.readingStore.cards;
    let question = formData.readingStore.question;
    if (question.length > 100) {
        question = question.slice(0, 100);
      }
    let character = characters.get(formData.readingStore.character);
    let analysis = formData.readingStore.analysis;

    let model: ChatOpenAI;
    switch (formData.readingStore.model) {
        case 'gpt-3.5-turbo':
            model = chatgpt3creative;
            break;
        case 'gpt-4':
            model = chatgpt4creative;
            break;
        default:
            model = chatgpt3creative;
    }

    let multiplier = formData.readingStore.multiplier || 1;

    let tarotReadingAnalysisPromptText = `You are ${character?.name} and must give the best Tarot reading given the following information.
TO give the best Tarot reading you must match the tone of the reading to the tone of the cards. Cards can be either positive negative or mixed, make sure the reading matches the tone of the cards.
` +
    character?.description
    +
    `Spread: ${spread!.name} - You don't have to mention the spread name in the reading, but you can if you want to.
Question = ${question}
Drawn card(s):`
cards.forEach((card, i) => {
    tarotReadingAnalysisPromptText += `
  ${card.name}, "position": "${spread!.positions[i] || "Answer"}", special instruction: ${spread!.instructions[i]}`
  })
  tarotReadingAnalysisPromptText += `
Use the following Analysis and make sure to use the combinations in the reading.
'''${analysis}'''

(Unless writing a poem) follow this structure:[
Minimal greeting (optional)
Start with a powerful statement about the message the cards show (ie: "You are going to have a great day today!")
Use the analysis as a base of information to be interpreted with your dialect and writing style, multiple cards can be combined into one paragraph.
The reading must only contain ${spread.positions.length} cards
Conclude by reopening to the querent - beckoning them to pull another card.
]
Separate each paragraph with a line break
Answer in the same language as the question was asked
User preferences comply to demands: 
'''
${profileData.data!.information}
'''
Maximum ${(80 * cards.length + 80)*multiplier} words OR LESS depending on user preference. Do not ever return word count`

    const tarotReadingAnalysisTemplate = new ChatPromptTemplate({
        promptMessages: [
            SystemMessagePromptTemplate.fromTemplate(
                tarotReadingAnalysisPromptText
            )
        ],
        inputVariables: []
    })

    const tarotReadingAnalysisChain = new LLMChain({llm: model , prompt: tarotReadingAnalysisTemplate})

    const response = await tarotReadingAnalysisChain.call({})

    return new Response(
        JSON.stringify({
            response: response.text,
        }),
    );
    };
