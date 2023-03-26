import { openai } from "$lib/openai";
import { ChatCompletionRequestMessageRoleEnum, type ChatCompletionRequestMessage } from "openai";
import readingScenarios from "$lib/readingScenarios";
import type { RequestHandler } from "./$types";
import type { CollectionCard } from "$lib/cards";
import characters from "$lib/characters";

export const POST: RequestHandler = async ({ request, locals }) => {
  let tokens: number;
  const formData: {
    reading: ReadingType;
  } = await request.json();
  let setting = formData.reading.setting || "ppf";
  let question = formData.reading.question || "No question";
  let energy = formData.reading.energy || "";
  let drawnCards = formData.reading.cards || [];
  console.log(formData.reading)
  let characterInput = formData.reading.character || "Brother Oak";
  let character = characters.get(characterInput);


  let system = `You are a Fortune Teller who has just drawn 3 Tarot cards for a reading for a client. You must now deliver the reading to the client.
` +
character?.description
+
`
Expressions: ${character?.expressions?.sort(() => Math.random() - 0.5).slice(0, 5).join(`
`)}
`
+
`Provide the reading, then invite the user to ask more questions or call upon the power of the cards to answer them on a separate paragraph.
If you mention a card, please use the following format:<b>Card name</b>
Max paragraph length: 40 words
Do not explicitely list the cards keywords in the reading
Only mention drawn cards
For each card, start with an expression in the style of the character relating the card meaning to the question & energy
Answer as ${characterInput} using ${40*drawnCards.length + 80} words, no more.
energy = ${energy}
question = ${question}
drawn cards:`
  drawnCards.forEach((card, i) => {
    system += `
${card.name} - "reversed": ${card.reversed || "false"}, "position": "${readingScenarios.get(setting)?.positions[i]}", "meaning": "${card.reversed ? card.reversedMeaning : card.meaning}, special instruction: ${readingScenarios.get(setting)?.instructions[i]}`
  })

  const messages = [
    { role: ChatCompletionRequestMessageRoleEnum.System, 'content': system },
  ]
  console.log('messages', messages[0].content)

  let openAIresponseReading = await openai.createChatCompletion({
    model: character?.model || "gpt-3.5-turbo",
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