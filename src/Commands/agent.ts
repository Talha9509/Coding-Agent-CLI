import { Command } from 'commander'
import { getCredentials } from './utils/getCredentials'
import { SystemPrompt } from './config'
import { editFileTool, readfileTool, writeFileTool } from './tools'
import openAIclient from './utils/openAIclient'
import type { ChatCompletionMessageParam } from "openai/resources/chat/completions"

export const agentCommand = new Command('agent')
  .description('Runs the agent')
  .option('-p, --prompt <prompt>', 'prompt', '')
  .action(async (options) => {
    console.log("User prompt is ..." + options.prompt);
    try {
      const credentials = await getCredentials()
      console.log(credentials.provider, credentials.model, credentials.apiKey)

      const client = await openAIclient(credentials.apiKey) 
      const messages: ChatCompletionMessageParam[] = []
      const tools: Record<string, any> = {
        'read_File': readfileTool,
        'write_File': writeFileTool,
        'edit_File': editFileTool,
      }

      messages.push({ role: 'system', content: SystemPrompt })
      messages.push({ role: 'user', content: options.prompt })

      console.log(`Thinking using ${credentials.provider} (${credentials.model})...`);

      let loop = true
      let iteration = 0
      while (loop) {
        iteration++
        console.log('iteration loop: ' + iteration)
        const response = await client.chat.completions.create({
          model: 'openrouter/free',
          messages: messages,
          response_format: { type: 'json_object' }
        })
        const aiResponse = response.choices[0]?.message.content

        messages.push({ role: 'assistant', content: aiResponse as string })

        console.log(`\n[Agent Thought]: ${aiResponse}`);
        const raw = String(aiResponse).trim()
        const call = JSON.parse(raw)

        if (call.type == 'output') {
          console.log(`AI: ${call.output}`)
          console.log("2nd loop ended")
          loop = false
        } else if (call.type == 'action') {
          console.log("running action")
          const fn = tools[call.function]
          const observation = await fn(call.function_arguments)
          const obs = { "type": "observation", "observation": observation }
          messages.push({ role: 'user', content: JSON.stringify(obs) })
        }
      }
    } catch (error) {
      console.log(`Error`);
      console.log(error)
    }
  })