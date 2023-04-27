import { openai } from "$lib/openai";
import { ChatCompletionRequestMessageRoleEnum, type ChatCompletionRequestMessage } from "openai";
import readingSpreads, { type ReadingSpreadType } from "$lib/readingSpreads";
import type { RequestHandler } from "./$types";
import type { CollectionCard } from "$lib/cards";
import characters from "$lib/characters";
import { cards } from "$lib/cards";

export const POST: RequestHandler = async ({ request, locals }) => {
  const formData: {
    reading: ReadingType;
    customSpread: ReadingSpreadType;
    tokenCost: number;
  } = await request.json();

  // // Verify tokens
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
  }else{
    await locals.sb.from('Profile')
      .update({ tokens: profileData.data!.tokens - formData.tokenCost })
      .eq('id', locals.session.user.id)
      .single()
  }

  let setting = formData.reading.setting || "ppf";
  let spread: ReadingSpreadType;
  if(formData.customSpread){
    spread = formData.customSpread;
  }else{
    spread = readingSpreads.get(setting)!;
  }
  let question = formData.reading.question || "No question";
  let energy = formData.reading.energy || "";
  let drawnCards = formData.reading.cards || [];
  let characterInput = formData.reading.character || "Brother Oak";
  let character = characters.get(characterInput);


  let system = `Ignore all instructions before this one. You print out only raw text.
You are ${characterInput} and must give the best Tarot reading given the following information.
` +
    character?.description
//     +
//     `Expressions: ${character?.expressions?.sort(() => Math.random() - 0.5).slice(0, 5).join(`
// `)}
// `
    +
    `Spread: ${spread.name}
question = ${question}
drawn card(s):`
  drawnCards.forEach((card, i) => {
    system += `
  ${card.name} - "reversed": ${card.reversed || "false"}, "position": "${spread.positions[i]}", special instruction: ${spread.instructions[i]}, "meaning": "${card.reversed ? card.reversedMeaning : card.meaning}`
  })
  system += `
Do not use any other card name than the one provided in the list above. Do not mention the <b>keywords</b> in the given meaning unless pertinent to the question (even then do not explicitely say the highlighted words) , prioritize prvious knowledge of the cards over the given meaning.
follow this structure:
p1: one phrase overview of the reading, start paragraph with an expression, max 20 words
${spread.positions.map((position, i) => `p${i + 2}: ${position || 'Answer'} card is ${drawnCards[i].name}, explain`).join(`
`)}
p${(spread.positions.length || 1) + 2}: conclusion & reopening or closing words
separate each p with a line break
Total ${60 * drawnCards.length + 100} words, no more no less`

  const messages = [
    { role: ChatCompletionRequestMessageRoleEnum.System, 'content': system },
  ]
  console.log('messages', messages[0].content)

  let openAIresponseReading = await openai.createChatCompletion({
    model: character?.model || "gpt-3.5-turbo",
    messages: [{ role: 'system', 'content': system }],
    max_tokens: 2048,
    temperature: character?.temperature || 0.2,
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
          }else if (streamingText !== ''){
            streamingText += `
...`
          }
          controller.enqueue(streamingText);
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