import { Command } from 'commander';
import { loginCommand } from './login';
import { logoutCommand } from './logout';

export const providerCommand = new Command("providers")
  .description("Provider related information")
  .addCommand(loginCommand)
  .addCommand(logoutCommand)

