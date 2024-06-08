import dotenv from "dotenv";
const envFile =
  process.env.NODE_ENV === "production" ? ".env" : ".env.development";
dotenv.config({ path: envFile });

import { Client, GatewayIntentBits } from "discord.js";

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.DirectMessages,
    GatewayIntentBits.MessageContent,
  ],
});

console.log(`running in ${process.env.NODE_ENV}`);
client.login(process.env.DISCORD_TOKEN);

client.once("ready", () => {
  console.log("Ready!");
});

export default client;
