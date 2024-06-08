import dotenv from "dotenv";
import fs from "fs/promises";
import { readdirSync } from "fs";
import { fileURLToPath } from "url";
import path, { dirname, join } from "path";
import { Client, GatewayIntentBits, Collection } from "discord.js";
import { registerCommands } from "./commands/utils/registerCommands.js";

// Define __filename and __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load environment variables
const envFile =
  process.env.NODE_ENV === "production" ? ".env" : ".env.development";
dotenv.config({ path: envFile });

// Initialize the Discord client
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.DirectMessages,
    GatewayIntentBits.MessageContent,
  ],
});

// Function to load all event listeners
const loadEventListeners = async () => {
  const eventListenerFiles = await fs.readdir(
    path.resolve(__dirname, "eventListeners")
  );

  for (const file of eventListenerFiles) {
    if (file.endsWith(".js")) {
      const { default: eventListener } = await import(
        path.resolve(__dirname, "eventListeners", file)
      );
      eventListener(client);
      console.log(`Event listener ${file} loaded.`);
    }
  }
};

// Function to load all commands
const loadCommands = async () => {
  client.commands = new Collection();

  const commandsPath = join(__dirname, "commands");
  const commandFiles = readdirSync(commandsPath).filter((file) =>
    file.endsWith(".js")
  );

  for (const file of commandFiles) {
    const filePath = join(commandsPath, file);
    const commandModule = await import(filePath);
    const command = commandModule.default; // Access the default property
    // Ensure the command has the required properties    // Ensure the command has the required properties
    if (command.data && command.execute) {
      client.commands.set(command.data.name, command);
    } else {
      console.log(
        `[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`
      );
    }
  }
};

// Load event listeners and commands, then log in the client
(async () => {
  await loadEventListeners();
  await loadCommands();
  console.log(`Running in ${process.env.NODE_ENV}`);
  await client.login(process.env.DISCORD_TOKEN);

  client.once("ready", async () => {
    console.log(`Logged in as ${client.user.tag}`);
    await registerCommands(client); // Register all commands when the bot is ready
  });
})();

export default client;
