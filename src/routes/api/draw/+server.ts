import { openai } from "$lib/openai";
import readingSpreads, { type ReadingSpreadType } from "$lib/readingSpreads";
import type { RequestHandler } from "@sveltejs/kit";
import { ChatCompletionRequestMessageRoleEnum, type ChatCompletionRequestMessage } from "openai";
import type { CollectionCard, CollectionDeck } from "$lib/cards";




export const POST: RequestHandler = async ({ request, locals }) => {
  const formData: {
    reading: ReadingType;
    collectionDecks: CollectionDeck[];
    customSpread: ReadingSpreadType;
    // tokenCost: number;
  } = await request.json();
  

  let setting = formData.reading.setting!;
  let spread: ReadingSpreadType;
  if(formData.customSpread){
    spread = formData.customSpread;
  }else{
    spread = readingSpreads.get(setting)!;
  }
  let energy = formData.reading.energy || "";
  let question = formData.reading.question + '?' || "No question";
  let collectionDecks = formData.collectionDecks || [];
  let trimmedQuestion = await trimQuestion(question);
  if (trimmedQuestion.toLowerCase().trim().slice(0, 5) === 'false') {
    return new Response(
      JSON.stringify({
        status: 200,
        body: {
          error: "... Try again ...." + trimmedQuestion.trim().slice(7)
        }
      }),
    );
  } else {
    question = trimmedQuestion;
  }

  // let tokenCost = formData.tokenCost || 999999999;

  // // Verify tokens
  // const profileData = await locals.sb.from('Profile')
  //   .select('*')
  //   .eq('id', locals.session.user.id)
  //   .single()

  // if (profileData.data!.tokens < tokenCost) {
  //   return new Response(
  //     JSON.stringify({
  //       error: "Not enough tokens",
  //     }),
  //   );
  // }else{
  //   await locals.sb.from('Profile')
  //     .update({ tokens: profileData.data!.tokens - tokenCost })
  //     .eq('id', locals.session.user.id)
  //     .single()
  // }

  let allAllowedCards: CollectionCard[] = [];
  collectionDecks.forEach((deck: CollectionDeck) => {
    if (deck.available) {
      deck.cards.forEach((card: CollectionCard) => {
        allAllowedCards.push(card);
      })
    }
  })

  let energyCards: {name: string, reversed: boolean}[] = [];
  let otherCards:  {name: string, reversed: boolean}[] = [];
  // Get cards for the energy, and other
  allAllowedCards.forEach((card: CollectionCard) => {
    if (card.energy.upright.includes(energy)) {
      energyCards.push({name: card.name, reversed: false});
    } else {
      if (card.energy.reversed.includes(energy)) {
        energyCards.push({name: card.name, reversed: true});
      }else{
        otherCards.push({name: card.name, reversed: Math.random() > 0.5});
      }
    }
  })

  // Shuffle the cards
  energyCards = energyCards.sort(() => Math.random() - 0.5)
  otherCards = otherCards.sort(() => Math.random() - 0.5)
  let cards = energyCards.concat(otherCards).slice(0, spread?.positions.length).sort(() => Math.random() - 0.5);
  console.log('cards', energyCards, cards)
  return new Response(
    JSON.stringify({
      status: 200,
      body: {
        cards: cards
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

