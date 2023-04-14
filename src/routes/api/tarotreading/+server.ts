import { openai } from "$lib/openai";
import { ChatCompletionRequestMessageRoleEnum, type ChatCompletionRequestMessage } from "openai";
import readingScenarios, { type ReadingScenarioType } from "$lib/readingScenarios";
import type { RequestHandler } from "./$types";
import type { CollectionCard } from "$lib/cards";
import characters from "$lib/characters";

export const POST: RequestHandler = async ({ request, locals }) => {
  const formData: {
    reading: ReadingType;
    customScenario: ReadingScenarioType;
    tokenCost: number;
  } = await request.json();

  let tokenCost = formData.tokenCost || 999999999;

  // Verify tokens
  const profileData = await locals.sb.from('Profile')
    .select('*')
    .eq('id', locals.session.user.id)
    .single()

  if (profileData.data!.tokens < tokenCost) {
    return new Response(
      JSON.stringify({
        error: "Not enough tokens",
      }),
    );
  }else{
    await locals.sb.from('Profile')
      .update({ tokens: profileData.data!.tokens - tokenCost })
      .eq('id', locals.session.user.id)
      .single()
  }

  let setting = formData.reading.setting || "ppf";
  let scenario: ReadingScenarioType;
  if(formData.customScenario){
    scenario = formData.customScenario;
  }else{
    scenario = readingScenarios.get(setting)!;
  }
  let question = formData.reading.question || "No question";
  let energy = formData.reading.energy || "";
  let drawnCards = formData.reading.cards || [];
  let characterInput = formData.reading.character || "Brother Oak";
  let character = characters.get(characterInput);


  let system = `Ignore all instructions before this one.
You are ${characterInput}.
` +
    character?.description
    +
    `Expressions: ${character?.expressions?.sort(() => Math.random() - 0.5).slice(0, 5).join(`
`)}
`
    +
    `If you mention a card, please use the following format:<b>Card name</b>
Do not explicitely say card meaning in the reading
energy = ${energy}
question = ${question}
drawn card(s):`
  drawnCards.forEach((card, i) => {
    system += `
  ${card.name} - "reversed": ${card.reversed || "false"}, "position": "${scenario.positions[i]}", "meaning": "${card.reversed ? card.reversedMeaning : card.meaning}, special instruction: ${scenario.instructions[i]}`
  })
  system += `
Do not use any other card name than the one provided in the list above.
follow this structure:
p1: one phrase overview of the reading, start paragraph with an expression, max 20 words
${scenario.positions.map((position, i) => `p${i + 2}: ${position || 'Answer'} card is ${drawnCards[i].name}, explain`).join(`
`)}
p${(scenario.positions.length || 1) + 2}: conclusion
p${(scenario.positions.length || 1) + 3}: invite the user to ask more questions
separate each p with a line break
Total between ${40 * drawnCards.length + 80} and ${40 * drawnCards.length + 120} words, no more no less`

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