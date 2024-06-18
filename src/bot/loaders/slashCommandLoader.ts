import fs from "fs/promises";
import path from "path";
import { Collection } from "discord.js";

export const loadSlashCommands = async (discordClient: any) => {
  discordClient.commands = new Collection();

  const commandsPath = path.resolve(
    new URL(".", import.meta.url).pathname,
    "../commands/slash"
  );
  const commandFiles = await fs.readdir(commandsPath);

  for (const file of commandFiles) {
    if (file.endsWith(".ts") && !file.endsWith(".test.ts")) {
      const filePath = path.resolve(commandsPath, file);
      const { default: command } = await import(filePath);

      if (command.data && command.execute) {
        discordClient.commands.set(command.data.name, command);
        console.log(`Slash command ${file} loaded.`);
      } else {
        console.log(
          `[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`
        );
      }
    }
  }
};
