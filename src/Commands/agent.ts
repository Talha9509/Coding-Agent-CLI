import { Command } from 'commander'
import { getCredentials } from './utils/getCredentials'
import { SystemPrompt } from './config'
import { readFile } from './tools'
import openAIclient from './utils/openAIclient'

export const agentCommand = new Command('agent')
  .description('Runs the agent')
  .option('-p, --prompt <prompt>', 'prompt', '')
  .action(async (options) => {
    console.log("User prompt is ..." + options.prompt);
    try {
      const credentials = await getCredentials()
      console.log(credentials.provider, credentials.model, credentials.apiKey)

      const client = await openAIclient(credentials.apiKey) 
      const messages: { role: string, content: string }[] = []
      const tools: Record<string, any> = {
        'readFile': readFile
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
          // @ts-ignore
          messages: messages,
          response_format: { type: 'json_object' }
        })
        const aiResponse = response.choices[0]?.message.content

        messages.push({ role: 'assistant', content: aiResponse as string })

        console.log(`\n[Agent Thought]: ${aiResponse}`);

        const call = JSON.parse(aiResponse as string)
        if (call.type == 'output') {
          console.log(`AI: ${call.output}`)
          console.log("2nd loop ended")
          loop = false
        } else if (call.type == 'action') {
          console.log("running action")
          const fn = tools[call.function]
          const observation = fn(call.input)
          const obs = { "type": "observation", "observation": observation }
          messages.push({ role: 'developer', content: JSON.stringify(obs) })
        }
      }
    } catch (error) {
      console.log(`Error`);
      console.log(error)
    }
  })