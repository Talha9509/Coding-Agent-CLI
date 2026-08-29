import OpenAI from 'openai'

export default async function openAIclient (apiKey: string){
  return new OpenAI({
    baseURL: "https://openrouter.ai/api/v1",
    apiKey: apiKey,
    defaultHeaders: {
      "HTTP-Referer": "http://localhost:3000",
    }
  });
}