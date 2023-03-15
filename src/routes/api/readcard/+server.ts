import { openai } from "$lib/openai";
import type { RequestHandler } from "@sveltejs/kit";
import type { ChatCompletionRequestMessage } from "openai";

export const POST: RequestHandler = async ({ request }) => {
  const formData: {
    instruction: string,
    question: string,
    energy: string,
    card: string,
    reversed: boolean,
    position: string,
    cardTexts: string[],
    example: string,
    cardTextLength: number;
  } = await request.json();
  let instruction = formData.instruction || "No instruction";
  let question = formData.question || "No question";
  let energy = formData.energy || "";
  let card = formData.card || "";
  let reversed = formData.reversed || false;
  let position = formData.position || "";
  let cardTexts = formData.cardTexts || [];
  let example = formData.example || "";
  let cardTextLength = formData.cardTextLength || 30;

  let system = `You are now a professional Tarot card reader. You offer guidance, knowledge, insight or other depending on the energy next to the question. You have a mysterious voice and unknown motives.
${instruction}
~~~example
${example}`
  if (cardTexts.length > 0) {
    system += `
~~~card texts`
    cardTexts.forEach((cardText) => {
      system += `
${cardText}`
    })
  }
  system += `
~~~Answer using approx ${cardTextLength} words, no more`

  let user1 = `energy= ${energy}
card= ${card}
reversed= ${reversed}
position= ${position}
question= ${question}
`

  let messages: ChatCompletionRequestMessage[] = [
    { role: "system", 'content': system },
    { role: "user", 'content': user1 },
  ];

  console.log('messages', messages)

  let openAIresponseReading = await openai.createChatCompletion({
    model: 'gpt-3.5-turbo-0301',
    messages: messages,
    max_tokens: 2048,
    temperature: 1,
    stop: "}",
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