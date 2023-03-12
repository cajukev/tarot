import { Configuration, OpenAIApi } from 'openai';
const configuration = new Configuration({
  apiKey: import.meta.env.VITE_OPENAI_SECRET_KEY
});
export const openai = new OpenAIApi(configuration);

