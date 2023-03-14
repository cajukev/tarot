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
  } = await request.json();
  let instruction = formData.instruction || "No instruction";
  let question = formData.question || "No question";
  let energy = formData.energy || "";
  let card = formData.card || "";
  let reversed = formData.reversed || false;
  let position = formData.position || "";
  let cardTexts = formData.cardTexts || [];
  let example = formData.example || "";

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
  ~~~Answer using approx 30 words, no more`

  let user1 = `energy= ${energy}
card= ${card}
reversed= ${reversed}
position= ${position}
question= ${question}
{"reading": "`

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
    stop: "}"
  })
  console.log(openAIresponseReading.data.choices[0].message?.content)
  console.log(('{"reading": "' + openAIresponseReading.data.choices[0].message?.content + '"}').replace('""','"').replace('}}', '}').replace('}}', '}'))
  let reading = JSON.parse(('{"reading": "' + openAIresponseReading.data.choices[0].message?.content + '"}').replace('""','"').replace('}}', '}').replace('}}', '}'));
  console.log('openAIresponseReading', reading.reading, openAIresponseReading.data.usage?.total_tokens)

  return new Response(
    JSON.stringify({
      status: 200,
      body: {
        reading: reading.reading
      }
    }),
  );
};