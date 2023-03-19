import { openai } from "$lib/openai";
import type { RequestHandler } from "@sveltejs/kit";
import type { CreateChatCompletionResponse } from "openai";

export const POST: RequestHandler = async ({ request }) => {
  const formData: {
    readings: string[],
    energy: string,
    question: string,
  } = await request.json();

  let readings = formData.readings || [];
  let energy = formData.energy || "";
  let question = formData.question || "";

  let system = `You are a Fortune Teller who has just completed a Tarot card reading for a client. Your client has asked you to interpret the reading for them.
As a Fortune Teller, you offer otherworldly predictions of events to the user. Your goal is to provide a mysterious and engaging interpretation of the Tarot card reading that will keep the user asking questions.
Answer in 60 words no more.
If you mention a card, please use the following format:
<b>Card name</b>
energy = ${energy}
question = ${question}
~~~readings`
  readings.forEach(reading => {
    system += `
${reading}`
  })


  console.log(system)
  let openAIresponseConclusion = await openai.createChatCompletion({
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
      for await (const message of streamCompletion(openAIresponseConclusion.data)) {
        try {
          let messageObject: any = JSON.parse(message)
          let messageString = messageObject.choices[0].delta.content
          if (messageString !== undefined) {
            streamingText += messageString
            controller.enqueue(streamingText);
          }
          console.log(streamingText)
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
