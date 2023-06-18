import type { RequestHandler } from "@sveltejs/kit";
import { Configuration, OpenAIApi } from "openai";
import fs from "fs";
import { Readable } from 'stream'

const configuration = new Configuration({
    apiKey: import.meta.env.VITE_OPENAI_SECRET_KEY,
  });
const openai = new OpenAIApi(configuration);

export const POST: RequestHandler = async ({ request, locals, fetch }) => {
    const formData: {
        audio: any;
    } = await request.json();

    console.log(formData);

    const audio = formData.audio;

    const blob = await fetch(audio).then((r) => r.blob());
    
    const fileName = 'recording.wav';
	const wavFile = new File([blob], fileName);
	const formData2 = new FormData();
	formData2.append('file', wavFile);
	formData2.append('model', 'whisper-1');

	const response = await fetch('https://api.openai.com/v1/audio/transcriptions', {
		method: 'POST',
		headers: {
			Authorization: `Bearer ${import.meta.env.VITE_OPENAI_SECRET_KEY}`
		},
		body: formData2
	})
    .then((r) => r.json())
    .then((r) => {
        console.log(r);
        return r;
    });



    
    return new Response(
        JSON.stringify({
            status: 200,
            body: {
                transcript: response,
            }
        }),
    );
};

