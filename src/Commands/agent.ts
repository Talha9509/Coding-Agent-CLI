import { Command } from 'commander'
import os from 'os'
import path from 'path'
import fs from 'fs'
import { createAnthropic } from '@ai-sdk/anthropic'
import { createOpenAI } from '@ai-sdk/openai'
import { createGoogleGenerativeAI } from '@ai-sdk/google'
import { createOpenRouter } from '@openrouter/ai-sdk-provider'
import { generateText, type LanguageModel, stepCountIs } from 'ai'
import { editFile, readFile, writeFile } from './tools'

const configPath = path.join(os.homedir(), '.codagent', '.codagent.json');

export const agentCommand = new Command('agent')
  .description('Runs the agent')
  .option('-p, --prompt <prompt>', 'prompt', '')
  .action(async (options) => {
    console.log("User prompt is ..." + options.prompt);

    let parsedFileData;
    try {
      const fileData = fs.readFileSync(configPath, 'utf-8')
      console.log(fileData)
      parsedFileData = JSON.parse(fileData)

      const provider = parsedFileData.activeProvider
      const model = parsedFileData.activeModel
      const apiKey = parsedFileData.apiKeys[provider]
      console.log(provider, model, apiKey)

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
      console.log(`Thinking using ${provider} (${model})...`);
      const result = await generateText({
        model: aiModel as LanguageModel,
        prompt: options.prompt,
        stopWhen: stepCountIs(10),
        maxRetries: 3,
        system: `You are an autonomous coding assistant. 
          You have access to tools to interact with the file system. 
          Do not ask the user for permission to use tools. 
          Do not ask the user which parameters to use. 
          Use given tools whenever required to edit, read, write a file to get the result user wants`,
        tools: { readFile, editFile, writeFile }
      })

      console.log('\n--- Final Answer ---');
      console.log(result);
      console.log(result.toolCalls);
      console.log(result.text);
      console.log(`Successfully gave result`);
    } catch (error) {
      console.log(`Error`);
      console.log(error)
    }
  })