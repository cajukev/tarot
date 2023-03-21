import { openai } from "$lib/openai";
import readingScenarios from "$lib/readingScenarios";
import type { RequestHandler } from "@sveltejs/kit";
import { ChatCompletionRequestMessageRoleEnum, type ChatCompletionRequestMessage } from "openai";
import { cards, type CollectionCard, type CollectionDeck } from "$lib/cards";

let decks: CollectionDeck[] = [];
for (let [key, value] of cards.entries()) {
  decks.push({ name: key, cards: value });
}


export const POST: RequestHandler = async ({request}) => {
  const formData: {
    setting: string;
    question: string;
    energy: string;
  } = await request.json();
  let setting = formData.setting || "ppf";
  let readingScenario = readingScenarios.get(setting);
  let question = formData.question || "No question";
    let trimmedQuestion = await trimQuestion(question);
    if (trimmedQuestion.toLowerCase().trim().slice(0, 5) === 'false') {
      return new Response(
        JSON.stringify({
          status: 200,
          body: {
            error: "... Try again ...."
          }
        }),
      );
    } else {
      question = trimmedQuestion;
    }
  
  let energy = formData.energy || "";
  let energyCardNames: string[] = [];
  // Get cards for the energy
  for (let pack of decks) {
    pack.cards.forEach((card: CollectionCard) => {
      if (card.energy.upright.includes(energy)) {
        energyCardNames.push(card.name);
      }else{
        if(card.energy.reversed.includes(energy)){
          energyCardNames.push(card.name + " (reversed)");
        }
      }
    })
  }
  console.log('energyCardNames', energyCardNames)
  let system = `You are now a professional Tarot card reader. You draw cards that tell a story, based on the value of {energy}.
  Here are the possible cards: [Ace to King of Pentacles - Swords - Cups - Wands and Major Arcana]. You must only use cards from this list. Every card can only be used once per reading.
  A card can be normal or reversed. At least 1 card must be reversed in a multi-card reading. All cards are different. 
  Scenario: ${readingScenario?.explanation}
  ~~~example
  energy: disaster
  ${readingScenario?.drawExample}
  ~~~`

  let user1 = `energy= ${energy}
Cards with this energy: [${energyCardNames}]
You must use at least one of these cards in your reading, set reversed to true if (reversed).
question= ${question}
[{`

let messages: ChatCompletionRequestMessage[] = [
    { role: ChatCompletionRequestMessageRoleEnum.System, 'content': system },
    { role: ChatCompletionRequestMessageRoleEnum.User, 'content': user1 },
  ]

  let openAIresponseCards = await openai.createChatCompletion({
    model: 'gpt-3.5-turbo-0301',
    messages: messages,
    max_tokens: 2048,
    temperature: 1,
    stop:`]`
  })
  console.log('openAIresponseCards', openAIresponseCards.data.choices[0].message?.content, openAIresponseCards.data.usage?.total_tokens)
  console.log(JSON.parse('[{' + openAIresponseCards.data.choices[0].message?.content + "]"))
  try {

    let cards = JSON.parse('[{' + openAIresponseCards.data.choices[0].message?.content + "]") as Card[];
    console.log('cards', cards)
    return new Response(
      JSON.stringify({
        status: 200,
        body: {
          cards: cards
        }
      }),
    );
  }catch (e) {
    return new Response(
      JSON.stringify({
        status: 200,
        body: {
          error: openAIresponseCards.data.choices[0].message
        }
      }),
    );
  }
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
The question can be in any language.
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