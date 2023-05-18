import { Configuration, OpenAIApi } from 'openai';
const configuration = new Configuration({
  apiKey: import.meta.env.VITE_OPENAI_SECRET_KEY
});
export const openai = new OpenAIApi(configuration);

import { OpenAIApi as OpenAIApiEdge, Configuration as ConfigurationEdge } from 'openai-edge';
const configurationEdge = new ConfigurationEdge({
  apiKey: import.meta.env.VITE_OPENAI_SECRET_KEY,
})
export const openaiEdge = new OpenAIApiEdge(configurationEdge)