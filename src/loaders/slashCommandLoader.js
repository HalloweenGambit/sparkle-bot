import { readdirSync } from "fs";
import { Collection } from "discord.js";
import { join } from "path";

export const loadSlashCommands = async (discordClient, dbClient, heyDoc) => {
  discordClient.commands = new Collection();

  const __dirname = new URL(".", import.meta.url).pathname;

  const commandsPath = join(__dirname, "../bot/commands/slash"); // Adjust the path here
  const commandFiles = readdirSync(commandsPath).filter((file) =>
    file.endsWith(".js")
  );

  for (const file of commandFiles) {
    const filePath = join(commandsPath, file);
    const commandModule = await import(filePath);
    const command = commandModule.default;

    if (command.data && command.execute) {
      discordClient.commands.set(command.data.name, command);
    } else {
      console.log(
        `[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`
      );
    }
  }
};
