import { createAnthropic } from '@ai-sdk/anthropic'
import { createOpenAI } from '@ai-sdk/openai'
import { createGoogleGenerativeAI } from '@ai-sdk/google'
import { createOpenRouter } from '@openrouter/ai-sdk-provider'

export const sendReq = (provider: string, model: any, apiKey: any) => {
  let aiModel;
  if (provider == 'gemini') {
    const google = createGoogleGenerativeAI({ apiKey: apiKey })
    aiModel = google(model)
  }
  else if (provider == 'claude') {
    const anthropic = createAnthropic({ apiKey: apiKey })
    aiModel = anthropic(model)
  }
  else if (provider == 'chatgpt') {
    const openAI = createOpenAI({ apiKey: apiKey })
    aiModel = openAI(model)
  }
  else if (provider == 'openrouter') {
    const openRouter = createOpenRouter({ api_keys: apiKey })
    aiModel = openRouter(model)
  }
  return aiModel;
}