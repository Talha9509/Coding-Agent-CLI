import { Command } from 'commander'

export const modelsCommand = new Command('models')
  .description('Returns all the supported models')
  .option('-m, --model <modelName>', 'name of the model', 'all')
  .option('-s, --set <modelName>', 'set', 'gemini:flash-3.5')
  .action((options) => {
    console.log("Listing Models.....")

    console.log(options)
  })