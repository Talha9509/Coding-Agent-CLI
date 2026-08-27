import { Command } from 'commander'

export const modelsCommand = new Command('models')
  .description('Returns all the supported commands')
  .option('-m, --model <modelName>', 'name of the model', 'all')
  .action((options) => {
    console.log("Listing Models.....")

    console.log(options)
  })