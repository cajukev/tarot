import { Configuration, OpenAIApi } from "openai-edge"
import { openaiEdge } from "$lib/openai";
import { ChatCompletionRequestMessageRoleEnum, type ChatCompletionRequestMessage } from "openai";
import readingSpreads, { type ReadingSpreadType } from "$lib/readingSpreads";
import type { RequestHandler } from "./$types";
import type { CollectionCard, CollectionDeck } from "$lib/cards";
import characters, { type Character } from "$lib/characters";
import { cards } from "$lib/cards";
import { unlocks } from "$lib/unlocks";

export const config = {
  runtime: 'edge',
};

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
    if (deck.exp){
      if (profile.experience < unlocks.get(deck.abbrv)!.exp) {
        hasAll = false;
      }
    }
  })
  return hasAll;
}

let hasReader = (character: Character, profile: any) => {
  return !character.pack  || 
		character.pack === 'unlock' && profile.data.experience >= (unlocks.get(character.name)?.exp || 0) ||
		character.pack && profile.data.bought_items.includes(character.pack)
}

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
  }else if(!hasReader(characters.get(formData.reading.character) as Character, profileData)){
    return new Response(
      JSON.stringify({
        error: "Reader not unlocked",
      }),
    );
  }else{

    await locals.sb.from('Profile')
      .update({ tokens: profileData.data!.tokens - formData.tokenCost })
      .eq('id', locals.session.user.id)
      .single()
  }
  if(!hasAllUsedPacks(formData.reading.cards, profileData.data!)){
    return new Response(
      JSON.stringify({
        error: "Cards not unlocked",
      }),
    );
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
  let model = formData.reading.model || "gpt-3.5-turbo";


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
  ${card.name} ${card.reversed ? "reversed" : ""}, "position": "${spread.positions[i] || "Answer"}", special instruction: ${spread.instructions[i]}, "meaning": "${card.reversed ? card.reversedMeaning : card.meaning}`
  })
  system += `
Do not use any other card name than the one provided in the list above. Do not repeat the meaning, prioritize previous knowledge of the cards over the given meaning.
follow this structure:
p1: greeting and one phrase overview of the reading to come
${spread.positions.map((position, i) => `p${i + 2}: ${position || 'Answer'} card is ${drawnCards[i].name} ${drawnCards[i].reversed ? "reversed" : ""}, explain`).join(`
`)}
p${(spread.positions.length || 1) + 2}: conclude by relating the cards together and to the question, reopening or closing words
separate each p with a line break
answer in the same language as the question was asked
Total ${60 * drawnCards.length + 120} words, no more no less`

  const messages = [
    { role: ChatCompletionRequestMessageRoleEnum.System, 'content': system },
  ]
  console.log('messages', messages[0].content)

  let openAIresponseReading = await openaiEdge.createChatCompletion({
    model: model || "gpt-3.5-turbo",
    messages: [{ role: 'system', 'content': system }],
    max_tokens: 2048,
    temperature: character?.temperature || 1,
    presence_penalty: 1.5,
    stream: true
  })

  return new Response(openAIresponseReading.body, {
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Content-Type": "text/event-stream;charset=utf-8",
      "Cache-Control": "no-cache, no-transform",
      "X-Accel-Buffering": "no",
    },
  })
//   return new Response(new ReadableStream({
//     async start(controller) {
//       let streamingText = '';
//       for await (const message of streamCompletion(openAIresponseReading.data)) {
//         try {
//           let messageObject: any = JSON.parse(message)
//           let messageString = messageObject.choices[0].delta.content
//           if (messageString !== undefined) {
//             streamingText += messageString
//           }else if (streamingText !== ''){
//             streamingText += `
// ...`
//           }
//           controller.enqueue(streamingText);
//         } catch (error) {
//           //console.error("Could not JSON parse stream message", message, error);
//         }
//       }
//       controller.close();
//     },
//   }),
//     { headers: { 'Content-Type': 'text/event-stream' } },
//   );
};

// async function* chunksToLines(chunksAsync: any) {
//   let previous = "";
//   for await (const chunk of chunksAsync) {
//     const bufferChunk = Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk);
//     previous += bufferChunk;
//     let eolIndex;
//     while ((eolIndex = previous.indexOf("\n")) >= 0) {
//       // line includes the EOL
//       const line = previous.slice(0, eolIndex + 1).trimEnd();
//       if (line === "data: [DONE]") break;
//       if (line.startsWith("data: ")) yield line;
//       previous = previous.slice(eolIndex + 1);
//     }
//   }
// }

// async function* linesToMessages(linesAsync: any) {
//   for await (const line of linesAsync) {
//     const message = line.substring("data :".length);

//     yield message;
//   }
// }

// async function* streamCompletion(data: any) {
//   yield* linesToMessages(chunksToLines(data));
// }