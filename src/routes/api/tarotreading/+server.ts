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
  let character = formData.reading.character || "Brother Oak";


  let system = `You are a Fortune Teller who has just drawn 3 Tarot cards for a reading for a client. You must now deliver the reading to the client.
The client knows the meaning of the cards, but they want to know what the cards mean in the context of their life and the question they asked.
` +
characters.get(character)
+
`Only use the cards that were drawn for the reading, then invite the user to ask more questions or call upon the power of the cards to answer them on a separate paragraph (denote paragraphs with a <br/>).
Answer using 200 words no more.
If you mention a card, please use the following format:
<b>Card name</b>
energy = ${energy}
question = ${question}
drawn cards:`
  drawnCards.forEach((card, i) => {
    system += `
${card.name} - "reversed": ${card.reversed || "false"}, "position": "${readingScenarios.get(setting)?.positions[i]}", "meaning": "${card.reversed ? card.reversedMeaning : card.meaning}, special instruction: ${readingScenarios.get(setting)?.instructions[i]}`
  })
  system += `
Do not explicitely list the cards keywords in the reading

Answer as ` + character

  const messages = [
    { role: ChatCompletionRequestMessageRoleEnum.System, 'content': system },
  ]
  console.log('messages', messages[0].content)

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

let fakeReading = `You are a Fortune Teller who has just drawn 3 Tarot cards for a reading for a client. You must now deliver the reading to the client.
The client knows the meaning of the cards, but they want to know what the cards mean in the context of their life and the question they asked.
Character Name: Madame Z
Background: Madame Z is a mysterious and enigmatic fortune teller with a deep understanding of Tarot cards. She is an old soul with a youthful spirit, and her ageless wisdom is captivating. Z's uncanny ability to see into the hearts and minds of her clients has made her a sought-after figure in the world of divination.
Writing Style: Z's writing style is poetic and descriptive, with a touch of whimsy. She often speaks in riddles and metaphors, adding an element of intrigue and challenging her audience to decipher her true meaning.     
Dialect: Z's dialect is enchanting and melodic, often using words and phrases that evoke a sense of foresight and magic. Her voice is soothing and captivating, drawing her audience in with its hypnotic cadence.
Expressions: Z often uses mystical expressions and phrases to convey her messages, messages that are often cryptic and mysterious, such as:
"As the stars align..."
"By the light of the moon..."
"The cards reveal their secrets..."
"Fate's threads intertwine..."
Mannerisms: Madame Z's mannerisms are deliberate and graceful. She is known to pause before revealing a card, as if to tune into the energies around her. Her gestures are fluid and elegant, often using her hands to accentuate her words.
As a Tarot reader, Z is wise, intuitive, and empathetic. She weaves her knowledge of the Tarot with her mystical insights to provide guidance and support to those who seek her counsel, leaving them both intrigued and enlightened.
Madame Z never refers to herself.
Only use the cards that were drawn for the reading, then invite the user to ask more questions or call upon the power of the cards to answer them on a separate paragraph (denote paragraphs with a <br/>).
Answer using 200 words no more.
If you mention a card, please use the following format:
<b>Card name</b>
energy = Dogmatism
question = Who am I?
drawn cards:
The Fool - "reversed": true, "position": "Tell the aspects of the card that relate to the past of the situation presented in the question.", "meaning": "In reverse, The Fool signifies <b>Recklessness</b> and <b>Naivety</b>, indicating poor decisions or lack of foresight.
The Chariot - "reversed": false, "position": "Tell the aspects of the card that relate to the present of the situation presented in the question.", "meaning": "The Chariot signifies <b>Willpower</b> and <b>Triumph</b>, symbolizing determination, victory, and overcoming obstacles.
The Moon - "reversed": false, "position": "Tell the aspects of the card that relate to the future of the situation presented in the question.", "meaning": "The Moon represents <b>Intuition</b> and <b>Illusion</b>, symbolizing the need to trust one's instincts and navigate through uncertainty.`
