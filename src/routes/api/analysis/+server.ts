import type { RequestHandler } from "@sveltejs/kit";
import { ChatOpenAI } from "langchain/chat_models/openai";
import readingSpreads from "$lib/readingSpreads";
import { AIMessagePromptTemplate, ChatPromptTemplate, SystemMessagePromptTemplate } from "langchain/prompts";
import { LLMChain } from "langchain/chains";

export const POST: RequestHandler = async ({request, locals}) => {

    const formData: {
        readingStore: ReadingType;
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

    const readingStore: ReadingType = formData.readingStore;
    let apiKey = import.meta.env.VITE_OPENAI_SECRET_KEY;
    const chatgpt3creative = new ChatOpenAI({ temperature: 1, modelName: "gpt-3.5-turbo", verbose: true, streaming: true, openAIApiKey: apiKey });
    const chatgpt3logical = new ChatOpenAI({ temperature: 0, modelName: "gpt-3.5-turbo", verbose: true, streaming: true, openAIApiKey: apiKey });

    const chatgpt4creative = new ChatOpenAI({ temperature: 1, modelName: "gpt-4", verbose: true, streaming: true, openAIApiKey: apiKey });
    const chatgpt4logical = new ChatOpenAI({ temperature: 0, modelName: "gpt-4", verbose: true, streaming: true, openAIApiKey: apiKey });

    const question = readingStore.question;
    const spread = readingSpreads.get(readingStore.setting);
    const cards = readingStore.cards;

    
    // Create a chain of LLMchains that can be used for tarot readings

    // Step 1. Create prompts & chains

    // Chain 1: Analyse the cards, positions, and question to give hints to the reader

    let  tarotAnalysisAIPromptCards = ``
    cards.forEach((card, i) => {
        tarotAnalysisAIPromptCards += `The ${spread?.positions[i]} card is the ${card.name} ${card.reversed ? '(reversed)' : ''} - ${card.reversed ? card.reversedMeaning : card.meaning }.
    `
    })

    const tarotAnalysisTemplate = new ChatPromptTemplate({
        promptMessages: [
            SystemMessagePromptTemplate.fromTemplate(
                `{empty} You understand the meaning of Tarot cards at an expert level and you are writing a book on advanced reading techniques. You read cards and come up with Observations considering the question. This chapter is about the question: ${question}.` 
        ),
        AIMessagePromptTemplate.fromTemplate(
            tarotAnalysisAIPromptCards + `Find some observations (at least ${cards.length - 1}) using pairs of cards and their keywords. State the observation using the keywords that led you to that observation.
Observation 1: ${cards[0].name} ${cards[0].reversed ? '(reversed)' : ''} in the ${spread?.positions[0]} position and ${cards[1].name} ${cards[1].reversed ? '(reversed)' : ''} in the ${spread?.positions[1]} position come together to mean `
            )
        ],
        inputVariables: [
            "empty"
        ]

    })

    const tarotAnalysisChain = new LLMChain({llm: chatgpt3creative, prompt: tarotAnalysisTemplate})

    

    const stream = new ReadableStream({
        start(controller) {
            let text = `Observation 1: ${cards[0].name} in the ${spread?.positions[0]} position and ${cards[1].name} in the ${spread?.positions[1]} position together mean `
    tarotAnalysisChain.call({empty: ""}
    , [{
    handleLLMNewToken(token: string) {
        text += token;
        controller.enqueue(text);
     }
    }]
    )
        }
    });


    return new Response(stream, {
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Content-Type": "text/event-stream;charset=utf-8",
          "Cache-Control": "no-cache, no-transform",
          "X-Accel-Buffering": "no",
        },
      })
};