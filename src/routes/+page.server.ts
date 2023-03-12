import type { Actions } from "@sveltejs/kit";
import { openai } from "$lib/openai";
import { ChatCompletionRequestMessageRoleEnum } from "openai";

export const actions: Actions = {
  generate: async ({ request, locals }) => {
    let tokens: number;
    const formData = await request.formData();
    console.log('formData', formData)
    console.log('locals', locals.session)
    if (locals.session?.user) {
      // Validate remaining generations
      const tokensData = await locals.sb.from('Profile')
        .select('tokens')
        .eq('id', locals.session.user.id)
      if (tokensData?.data?.at(0)?.tokens <= 2) {
        return {
          status: 400,
          body: 'Not enough tokens'
        }
      }

      // Update remaining generations
      tokens = tokensData?.data?.at(0)?.tokens - 3
      console.log('tokens', tokens)
      await locals.sb.from('Profile')
        .update({ tokens: tokens })
        .eq('id', locals.session.user.id)
    } else {
      tokens = parseInt(formData.get('tokens') + "") || 0;
    }


    let question = (formData.get('question') + "") || "nothing";
    if (question.length > 20) {
      question = question.substring(0, 20)
    }

    const system = `You are now a robot trained to perform Tarot card readings and return only an object. Give a 3 card reading for the {question}. Your goal is to make the user feel excitement.
Randomly generate 3 numbers from 1 to 21, use the card at that index. 
Here are the possible cards: [The Magician, The High Priestess, The Empress, The Emperor, The Hierophant, The Chariot, Strength, The Hermit, Wheel of Fortune, Justice, The Hanged Man, Death, Temperance, The Devil, The Moon, The Sun, Judgement, The World, The Fool]. You cannot use a card that is not in this list.
A card can be normal or reversed. Explain the reverse only when the card is reversed.
The 1st card is for the past, 2nd for the present, 3rd for the future.
A reading is at least 30 words.
~~~example
question: How will having a baby go?
{"cards": [
{"title": "The High Priestess", "reversed": false, "reading": "In the past, you have witnessed a skilled and experienced support system during others pregnancies. This has provided you with peace of mind and ensure a safe delivery."},
{"title": "The Devil", "reversed": true, "reading": "You experience feelings of anxiety or fear about your pregnancy. It being reversed suggests overcoming those feelings or challenges, so seek support from loved ones and professionals to help you manage these emotions."},
{"title": "The World", "reversed": true, "reading": "You may encounter unexpected complications or setbacks during your pregnancy or delivery.  Reversed, it indicates a release from that complexity."}],
"conclusion": "While there may be unexpected challenges and emotional struggles, you have a strong support system in place to help you navigate them and ensure a safe delivery."}
~~~
`;
    const messages = [
      { role: ChatCompletionRequestMessageRoleEnum.System, 'content': system },
      { role: ChatCompletionRequestMessageRoleEnum.User, 'content': `question: ${question}` },
    ]
    const user = `question: ${question}`;
    let response = await openai.createChatCompletion({
      model: 'gpt-3.5-turbo',
      messages: messages,
      max_tokens: 1000,
    })
    let responseText = response.data.choices[0].message?.content
    console.log('responseText', responseText)
    if (!responseText) {
      return {
        status: 500,
        body: 'Error'
      }
    }
    return {
      status: 200,
      body: {
        question: question,
        text: responseText,
        tokens: tokens - 3
      }
    }
  },

  fakeGenerate: async ({ request, locals }) => {
    return {
      status: 200
      }
    }
};