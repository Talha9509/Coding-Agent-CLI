
import { Command } from 'commander';
import os from 'os'
import path from 'path'
import fs from 'fs'

const configPath = path.join(os.homedir(), '.codagent', '.codagent.json');

export const logoutCommand = new Command("logout")
  .description('Lets user logout from the provider')
  .option('-p, --provider <providerName>', 'Name of the Provider', '')
  .action((options) => {
    const config = {
      activeProvider: '',
      apiKeys: {
        [options.provider]: ''
      }
    }

    try {
      fs.writeFileSync(configPath, JSON.stringify(config, null, 2))
    } catch (error) {
      console.log(`Error logging out from ${options.provider}!`);
    }
    
    console.log(`Successfully logged out from ${options.provider}!`);
  })




