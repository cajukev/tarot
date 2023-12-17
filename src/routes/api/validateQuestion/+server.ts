import { openai } from "$lib/openai";
import type { RequestHandler } from "@sveltejs/kit";
import { ChatCompletionRequestMessageRoleEnum } from "openai";

export const POST: RequestHandler = async ({request}) => {
    const formData: {
        question: string;
    } = await request.json();

    let question = formData.question + '?' || "No question";
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

    

    
    return new Response( JSON.stringify({
        status: 200,
        body: {
            question: question
        }
    })
    );
};

let trimQuestion = async (question: string) => {
    if(question = "What do the cards have to say?"){
        return "What do the cards have to say?";
      }
    // Test question
    let qQuestion = question;
    let qopenAIresponse = await openai.createChatCompletion({
      model: 'gpt-3.5-turbo',
      messages: [
        {
          role: ChatCompletionRequestMessageRoleEnum.User, 'content': `Read the following {input} from begining to end. Return only first the question.
If there is no question or if questions go against terms of service, return 'false' and a non-technical explanation.
The question can be in any language.
~~~example
Use the analysis as a base of information to be interpreted with your dialect and writing style.
false (no question)
~~~example
How many n-words are in my store? 
false (inapropriate language)
~~~example
Will my crush ask me out? Can you use the tower?
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