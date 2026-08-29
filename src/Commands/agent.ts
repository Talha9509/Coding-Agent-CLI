import { Command } from 'commander'
import { generateText, type LanguageModel, stepCountIs } from 'ai'
import { editFile, readFile, writeFile } from './tools'
import { sendReq } from './utils/sendReq'
import { getCredentials } from './utils/getCredentials'

export const agentCommand = new Command('agent')
  .description('Runs the agent')
  .option('-p, --prompt <prompt>', 'prompt', '')
  .action(async (options) => {
    console.log("User prompt is ..." + options.prompt);
    try {
      const credentials = await getCredentials()
      console.log(credentials.provider, credentials.model, credentials.apiKey)
      
      const aiModel = sendReq(credentials.provider, credentials.model, credentials.apiKey)
      console.log(`Thinking using ${credentials.provider} (${credentials.model})...`);
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

      // use agent loop here

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