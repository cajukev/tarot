import { openai } from "$lib/openai";
import { ChatCompletionRequestMessageRoleEnum, type ChatCompletionRequestMessage } from "openai";
import readingScenarios from "$lib/readingScenarios";
import type { RequestHandler } from "./$types";
import type { CollectionCard } from "$lib/cards";

export const POST: RequestHandler = async ({ request, locals }) => {
  let tokens: number;
  const formData: {
    reading: ReadingType;
  } = await request.json();
  let setting = formData.reading.setting || "ppf";
  let question = formData.reading.question || "No question";
  let energy = formData.reading.energy || "";
  let drawnCards = formData.reading.cards || [];


  let system = `You are a Fortune Teller who has just drawn 3 Tarot cards for a reading for a client. You must now deliver the reading to the client.
The client knows the meaning of the cards, but they want to know what the cards mean in the context of their life and the question they asked.
The witch wishes the best for the client, but she is not afraid to tell them the truth.
As a Fortune Teller, you offer otherworldly predictions of events to the user. Your goal is to provide a mysterious and engaging interpretation of the Tarot card reading that will keep the user asking questions.
Answer using beautiful prose, imagerie, links, analogies.
Start with a phrase quickly linking the cards to the question and to each other.
Only use the cards that were drawn for the reading, then invite the user to ask more questions or call upon the power of the cards to answer them on a separate paragraph (denote paragraphs with a <br/>).
Answer using 80 words or less.
If you mention a card, please use the following format:
<b>Card name</b>
energy = ${energy}
question = ${question}
drawn cards:`
  drawnCards.forEach((card, i) => {
    system += `
${card.name} - "reversed": ${card.reversed || "false"}, "position": "${readingScenarios.get(setting)?.instructions[i]}", "meaning": "${card.reversed ? card.reversedMeaning : card.meaning}`
  })

  const messages = [
    { role: ChatCompletionRequestMessageRoleEnum.System, 'content': system },
  ]
  console.log('messages', messages)

  let openAIresponseReading = await openai.createChatCompletion({
    model: 'gpt-4',
    messages: [{ role: 'system', 'content': system }],
    max_tokens: 2048,
    temperature: 1,
    stream: true
  },
    { responseType: "stream" })


  return new Response(new ReadableStream({
    async start(controller) {
      let streamingText = '';
      for await (const message of streamCompletion(openAIresponseReading.data)) {
        try {
          let messageObject: any = JSON.parse(message)
          let messageString = messageObject.choices[0].delta.content
          if (messageString !== undefined) {
            streamingText += messageString
            controller.enqueue(streamingText);
          }
        } catch (error) {
          //console.error("Could not JSON parse stream message", message, error);
        }
      }
      controller.close();
    },
  }),
    { headers: { 'Content-Type': 'text/event-stream' } },
  );
};

async function* chunksToLines(chunksAsync: any) {
  let previous = "";
  for await (const chunk of chunksAsync) {
    const bufferChunk = Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk);
    previous += bufferChunk;
    let eolIndex;
    while ((eolIndex = previous.indexOf("\n")) >= 0) {
      // line includes the EOL
      const line = previous.slice(0, eolIndex + 1).trimEnd();
      if (line === "data: [DONE]") break;
      if (line.startsWith("data: ")) yield line;
      previous = previous.slice(eolIndex + 1);
    }
  }
}

async function* linesToMessages(linesAsync: any) {
  for await (const line of linesAsync) {
    const message = line.substring("data :".length);

    yield message;
  }
}

async function* streamCompletion(data: any) {
  yield* linesToMessages(chunksToLines(data));
}
