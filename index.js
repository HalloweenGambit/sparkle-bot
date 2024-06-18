import { registerCommands } from "./src/bot/commands/utils/registerCommands.js";
import { loadEventListeners } from "./src/loaders/eventListenerLoader.js";
import { loadSlashCommands } from "./src/loaders/slashCommandLoader.js";
import gpt from "./src/loaders/geminiProLoader.js";
import dbClient from "./config/dbConfig.js";
import discordClient from "./config/discordConfig.js";

const startBot = async () => {
  await loadEventListeners(discordClient, dbClient, gpt);
  await loadSlashCommands(discordClient, dbClient, gpt);

  await discordClient.login(process.env.DISCORD_TOKEN);

  discordClient.once("ready", async () => {
    console.log(`Logged in as ${discordClient.user.tag}`);
    await registerCommands(discordClient);
  });
};

await startBot();
