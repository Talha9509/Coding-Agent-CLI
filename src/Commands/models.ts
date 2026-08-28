import { Command } from 'commander'
import os from 'os'
import path from 'path'
import fs from 'fs'
import axios from 'axios'

const configPath = path.join(os.homedir(), '.codagent', '.codagent.json');

export const modelsCommand = new Command('models')
  .description('Returns all the supported models')
  .option('-m, --model <modelName>', 'name of the model', 'all')
  .option('-s, --set <modelName>', 'set', '')
  .action(async (options) => {
    console.log("Listing Models.....")
    let parsedFileData;
    try {
      const fileData = fs.readFileSync(configPath, 'utf-8')
      console.log(fileData)
      parsedFileData = JSON.parse(fileData)
      if (!options.set) {
        if (parsedFileData.activeProvider == 'claude') {
          const response = await axios.get('https://api.anthropic.com/v1/models', {
            headers: {
              'x-api-key': process.env.ANTHROPIC_API_KEY,
              'anthropic-version': '2023-06-01',
              'content-type': 'application/json'
            }
          })
          console.log(response.data)
          const allModels = response.data.data
          allModels.map((model: any) => {
            console.log(model.display_name)
          })
        }
        else if (parsedFileData.activeProvider == 'gemini') {
          const response = await axios.get('https://generativelanguage.googleapis.com/v1beta/models?pageSize=10', {
            headers: {
              'x-goog-api-key': process.env.GEMINI_API_KEY,
              'content-type': 'application/json'
            }
          })
          const textModels = response.data.models.filter((model: any) =>
            model.supportedGenerationMethods?.includes("generateContent") &&
            model.displayName.startsWith("Gemini")
          );
          textModels.map((model: any) => {
            console.log(model.displayName)
          })
        }
        else if (parsedFileData.activeProvider == 'chatgpt') {
          const response = await axios.get('https://api.openai.com/v1/models', {
            headers: {
              'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
              'content-type': 'application/json'
            }
          })
          const allModels = response.data.data;
          const codingModels = allModels.filter((model: any) =>
            model.id.startsWith('gpt-5') ||
            model.id.startsWith('gpt-4') ||
            model.id.startsWith('gpt-3') ||
            model.id.startsWith('o1') ||
            model.id.startsWith('o3')
          );

          codingModels.map((model: any) => {
            console.log(model.id)
          })
        }
      } else {
        const config = {
          activeProvider: parsedFileData.activeProvider,
          activeModel: options.set,
          apiKeys: {
            [parsedFileData.activeProvider]: parsedFileData.apiKeys[parsedFileData.activeProvider]
          }
        }
        console.log(config)

        fs.writeFileSync(configPath, JSON.stringify(config, null, 2))
      }
    } catch (error) {
      console.log(`Error Fetching all models of ${parsedFileData.activeProvider}!`);
    }

    console.log(`Successfully fetched all models of ${parsedFileData.activeProvider}`);
  })
