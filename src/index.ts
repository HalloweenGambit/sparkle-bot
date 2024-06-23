import { registerCommands } from "./utils/registerCommands";
import { loadEventListeners } from "./bot/loaders/eventListenerLoader";
import { loadSlashCommands } from "./bot/loaders/slashCommandLoader";
import gpt from "./bot/loaders/geminiProLoader";
import dbClient from "./config/dbConfig";
import discordClient from "./config/discordConfig";

const startBot = async () => {
  await loadEventListeners(discordClient, dbClient, gpt);
  await loadSlashCommands(discordClient);

  await discordClient.login(process.env.DISCORD_TOKEN);

  discordClient.once("ready", async () => {
    console.log(`Logged in as ${discordClient.user.tag}`);
    await registerCommands(discordClient);
  });
};

await startBot();
