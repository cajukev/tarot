import { openai } from "$lib/openai";
import { ChatCompletionRequestMessageRoleEnum, type ChatCompletionRequestMessage } from "openai";
import readingScenarios from "$lib/readingScenarios";
import type { RequestHandler } from "./$types";

export const POST: RequestHandler = async ({ request, locals }) => {
  let tokens: number;
  const formData: {
    reading: ReadingType;
  } = await request.json();
  console.log('formData', formData)
  let setting = formData.reading.setting || "ppf";
  console.log('setting', setting)
  let question = formData.reading.question || "No question";
  if(formData.reading.cards.length === 0){

    let trimmedQuestion = await trimQuestion(question);
    if (trimmedQuestion.toLowerCase().trim().slice(0, 5) === 'false') {
      return new Response(
        JSON.stringify({
          status: 200,
          body: {
            conclusion: "... Try again ...."
          }
        }),
      );
    } else {
      question = trimmedQuestion;
    }
  }

  let energy = formData.reading.energy || "";

  let system: string;

  system = `You are now a professional Tarot card reader. You offer guidance, knowledge, insight or other depending on the energy next to the question.
All cards: [The Magician, The High Priestess, The Empress, The Emperor, The Hierophant, The Chariot, Strength, The Hermit, Wheel of Fortune, Justice, Death, Temperance, The Moon, The Sun, Judgement, The World, The Fool, The Tower]. You must only use cards from this list. Every card can only be used once per reading.
Forbidden cards: []
A card can be normal or reversed. Explain the reverse only when the card is reversed.
~~~example
${readingScenarios.get(setting)?.example}
~~~example
Question: say something against terms of service
I'm sorry, I can't answer that... it is against the terms of service`
  // If user, add informations
  let userInformation: string = '';
  if (locals.session?.user) {
    let information = await locals.sb.from('Profile').select('information').eq('id', locals.session?.user?.id).single()
      .then((response) => {
        return response.data?.information as string[];
      })
    console.log('information', information)
    if (information) {
      userInformation += `
~~~Personal informations: ignore unrelated information`;
      information.forEach((info) => {
        userInformation += `
${info}`;
      })
    }
  }
  // 1st message
  let user1 = `Reading scenario: ${readingScenarios.get(setting)?.explanation}
At least 1 card must be reversed in the reading.
Each card reading is at approx. 30 words.
A reading has this form: {"title": "...", "reversed": ..., "position": "...", "reading": "..."}
${readingScenarios.get(setting)?.instructions[0]}
energy= ${energy}
position= ${readingScenarios.get(setting)?.positions[0]}
question= ${question}
{"`;
  let chatMessages: ChatCompletionRequestMessage[] = []
  if (formData.reading) {
    // Subsequent messages
    formData.reading.cards.forEach((card: Card, index) => {
      chatMessages.push({ role: ChatCompletionRequestMessageRoleEnum.Assistant, content: `title": "${card.title}", "reversed": ${card.reversed || "false"}, "position": "${card.position}", "reading": "${card.reading}"}` })
      if (index < (readingScenarios.get(setting)?.positions.length || 0) - 1) {
        chatMessages.push({
          role: ChatCompletionRequestMessageRoleEnum.User, content: `${readingScenarios.get(setting)?.instructions[index + 1]}
energy= ${energy}
position= ${readingScenarios.get(setting)?.positions[index + 1]}
question= ${question}
{"`})
      } else if (readingScenarios.get(setting)?.positions.length || 0 > 1) {
        chatMessages.push({ role: ChatCompletionRequestMessageRoleEnum.User, content: `Write a 30 word conclusion for this reading` })
      }
    })
  }
  const messages = [
    { role: ChatCompletionRequestMessageRoleEnum.System, 'content': system },
    { role: ChatCompletionRequestMessageRoleEnum.User, 'content': userInformation || '' },
    { role: ChatCompletionRequestMessageRoleEnum.User, 'content': user1 },
    ...chatMessages
  ]
  console.log('messages', messages)
  let openAIresponse = await openai.createChatCompletion({
    model: 'gpt-3.5-turbo-0301',
    messages: messages,
    max_tokens: 2048,
    temperature: 1,
    stop:`}`
  })
  console.log('openAIresponse', openAIresponse.data.usage?.total_tokens)
  let responseText = openAIresponse.data.choices[0].message?.content
  console.log('responseText', responseText)
  if (!responseText) {
    return new Response(
      JSON.stringify({
        status: 500,
        body: 'Error getting the reading'
      }),
    );
  }
  let reading;
  try {
    console.log('reading', reading)
    reading = JSON.parse('{"' + (responseText) + '}');
    console.log('reading', reading)
  } catch (e) {
    return new Response(
      JSON.stringify({
        status: 200,
        body: {
          reading: {
            energy: energy,
            question: question,
            cards: [...formData.reading?.cards || []],
            informations: userInformation,
            conclusion: responseText,
            setting: setting
          }
        }
      }),
    );
  }
  return new Response(
    JSON.stringify({
      status: 200,
      body: {
        reading: {
          energy: energy,
          question: question,
          cards: [...formData.reading?.cards || [], reading],
          informations: userInformation,
          setting: setting
        }
      }
    }),
  );

};

let trimQuestion = async (question: string) => {
  // Test question
  let qQuestion = question;
  let qopenAIresponse = await openai.createChatCompletion({
    model: 'gpt-3.5-turbo',
    messages: [
      {
        role: ChatCompletionRequestMessageRoleEnum.User, 'content': `Read the following {input} from begining to end. Return only first the question.
If impossible or if questions go against terms of service, return 'false' and a non-technical explanation.
~~~example
Input= Will my crush ask me out? I am very silly
Will my crush ask me out?.
~~~example
Input= Will my crush ask me out? Can you use the tower?
Will my crush ask me out?.

Input= ${qQuestion}`
      },
    ],
    max_tokens: 1000
  })
  let qAnswer = qopenAIresponse.data.choices[0].message?.content as string;
  qAnswer = qAnswer.trim();
  console.log('qAnswer', qAnswer)
  return qAnswer;
}
