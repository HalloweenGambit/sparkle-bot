import { Client, GatewayIntentBits } from "discord.js";
import DotenvFlow from "dotenv-flow";

let discordClient = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.DirectMessages,
    GatewayIntentBits.MessageContent,
    // GatewayIntentBits.MessageReactions,
    // GatewayIntentBits.GuildVoiceStates,
  ],
});
discordClient.once("ready", async () => {
  await discordClient.login(process.env.DISCORD_TOKEN);
});

export default discordClient;
