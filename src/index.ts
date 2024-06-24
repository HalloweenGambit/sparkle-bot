import DotenvFlow from "dotenv-flow";
import { registerCommands } from "./utils/registerCommands";
import { loadEventListeners } from "./bot/loaders/eventListenerLoader";
import { loadSlashCommands } from "./bot/loaders/slashCommandLoader";
import discordClient from "./config/discordConfig";

DotenvFlow.config();

const startBot = async () => {
  await loadEventListeners(discordClient);
  await loadSlashCommands(discordClient);

  discordClient.once("ready", async () => {
    await discordClient.login(process.env.DISCORD_TOKEN);

    if (discordClient.user) {
      console.log(`Logged in as ${discordClient.user.tag}`);
    }
    await registerCommands(discordClient);
  });
};

await startBot();
