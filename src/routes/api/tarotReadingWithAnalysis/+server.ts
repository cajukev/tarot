import characters from "$lib/characters";
import type { ReadingSpreadType } from "$lib/readingSpreads";
import readingSpreads from "$lib/readingSpreads";
import type { RequestHandler } from "@sveltejs/kit";
import { LLMChain } from "langchain";
import { ChatOpenAI } from "langchain/chat_models/openai";
import { ChatPromptTemplate, SystemMessagePromptTemplate } from "langchain/prompts";

export const config = {
    runtime: 'edge',
  };

let apiKey = import.meta.env.VITE_OPENAI_SECRET_KEY;
const chatgpt3creative = new ChatOpenAI({ temperature: 1, modelName: "gpt-3.5-turbo", verbose: true, streaming: true, openAIApiKey: apiKey });
const chatgpt3logical = new ChatOpenAI({ temperature: 0, modelName: "gpt-3.5-turbo", verbose: true, streaming: true, openAIApiKey: apiKey });

const chatgpt4creative = new ChatOpenAI({ temperature: 1, modelName: "gpt-4", verbose: true, streaming: true, openAIApiKey: apiKey });
const chatgpt4logical = new ChatOpenAI({ temperature: 0, modelName: "gpt-4", verbose: true, streaming: true, openAIApiKey: apiKey });

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

    let tarotReadingAnalysisPromptText = `{empty} You are ${character?.name} and must give the best Tarot reading given the following information.
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
  tarotReadingAnalysisPromptText += `Use the following Analysis and make sure to adapt them to the character you are playing:
    ${analysis}
(Unless writing a poem) follow this structure:
minimal greeting
Talk about the cards in the order they were drawn naming them and using the knowledge above once all the associated cards have been explained
conclude by reopening to the querent
separate each paragraph with a line break
answer in the same language as the question was asked
Total ${60 * cards.length + 120} words, no more no less (unless writing a poem), do not ever return word count`

    const tarotReadingAnalysisTemplate = new ChatPromptTemplate({
        promptMessages: [
            SystemMessagePromptTemplate.fromTemplate(
                tarotReadingAnalysisPromptText
            )
        ],
        inputVariables: [
            "empty"
        ]
    
    })

    const tarotReadingAnalysisChain = new LLMChain({llm: model , prompt: tarotReadingAnalysisTemplate})

    const stream = new ReadableStream({
        start(controller) {
            let utf8Encode = new TextEncoder();
            let text = ''
            tarotReadingAnalysisChain.call({empty: ""}
    , [{
    handleLLMNewToken(token: string) {
        text += token;
        let textBytes = utf8Encode.encode(text);
        controller.enqueue(textBytes);
     }
    }]
    )
        }
    })

    return new Response(stream, {
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Content-Type": "text/event-stream;charset=utf-8",
          "Cache-Control": "no-cache, no-transform",
          "X-Accel-Buffering": "no",
        },
      })
    };
