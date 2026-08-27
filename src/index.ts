import { program } from 'commander'
import { modelsCommand } from './Commands/models';
import { agentCommand } from './Commands/agent';

program
  .name('codagent')
  .description('Coding Agent CLI')
  .version('1.0.0')
  .addCommand(modelsCommand)
  .addCommand(agentCommand)

program.parse();
