import { Command } from 'commander';
import os from 'os'
import path from 'path'
import fs from 'fs'

const configPath = path.join(os.homedir(), '.codagent', '.codagent.json');

export const loginCommand = new Command("login")
  .description('Lets user login into the provider')
  .option('-p, --provider <providerName>', 'Name of the Provider', '')
  .option('-a, --api_key <apiKey>', 'Your API Key', '')
  .action((options) => {
    console.log(options)
    
    console.log(configPath)
    const config = {
      activeProvider: options.provider,
      apiKeys: {
        [options.provider]: options.api_key
      }
    }

    try {
      fs.writeFileSync(configPath, JSON.stringify(config, null, 2))
    } catch (error) {
      console.log(`Error logging into ${options.provider}!`);
    }
    
    console.log(`Successfully logged into ${options.provider}!`);
  })

