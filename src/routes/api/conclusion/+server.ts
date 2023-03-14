import { openai } from "$lib/openai";
import type { RequestHandler } from "@sveltejs/kit";

export const POST: RequestHandler = async ({request}) => {
  const formData: {
    readings: string[],
  } = await request.json();

  let readings = formData.readings || [];

  let system = `As a fortune teller, using mysterious language, summarize the folowing readin into approx 40 words:`
  readings.forEach(reading => {
    system += `
    ${reading}`
  })
  
  let openAIresponseConclusion = await openai.createChatCompletion({
    model: 'gpt-3.5-turbo-0301',
    messages: [{role: 'system', 'content': system}],
    max_tokens: 2048,
    temperature: 1
  })
  console.log(system)
  let conclusion = openAIresponseConclusion.data.choices[0].message?.content;
  console.log('openAIresponseConclusion', conclusion, openAIresponseConclusion.data.usage?.total_tokens)

  return new Response(
    JSON.stringify({
      status: 200,
      body: {
        conclusion: conclusion
      }
    }),
  );
};