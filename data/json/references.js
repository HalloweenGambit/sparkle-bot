import path from "path";
import { fileURLToPath } from "url";
import DotenvFlow from "dotenv-flow";
import fs from "fs";
import { inspect } from "util";
import { Client, GatewayIntentBits } from "discord.js";

// Get the directory name of the current module
const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Load environment variables
DotenvFlow.config({
  path: path.resolve(__dirname, "../../"), // Ensure this path correctly points to the directory containing your .env files
});

// Create Discord client instance
const discordClient = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.DirectMessages,
    GatewayIntentBits.MessageContent,
  ],
});

await discordClient.login(process.env.DISCORD_TOKEN);

// Function to inspect and output a JSON file for each object
const inspectAndOutput = async (obj) => {
  let objInfo;
  if (obj instanceof Map) {
    // For Map objects, convert to an array to inspect
    objInfo = inspect([...obj], {
      showHidden: false,
      depth: 1, // Set depth to null to include circular references
      compact: true, // Output will not be compacted for better formatting
    });
  } else if (typeof obj === "object" && obj !== null) {
    // For other objects, inspect normally
    objInfo = inspect(obj, {
      showHidden: false,
      depth: 1, // Set depth to null to include circular references
      compact: true, // Output will not be compacted for better formatting
      getters: true, // Include getters in the output
    });
  } else {
    // For primitive types and undefined, handle accordingly
    objInfo = "undefined";
  }

  // Write object information to a JSON file
  fs.writeFileSync(
    `${(obj?.constructor?.name || "undefined").toLowerCase()}.json`,
    objInfo
  );

  // Log the object information to the console
  console.log(objInfo);
};

// Wait for the client to be ready
discordClient.once("ready", async () => {
  // Fetch the first guild and the first channel
  const firstGuild = discordClient.guilds.cache.first();
  const firstChannel = discordClient.channels.cache.first();

  // Add the first guild and the first channel to the objects to inspect array
  objectsToInspect[1] = firstGuild;
  objectsToInspect[2] = firstChannel;

  // Loop through objects to inspect
  for (const obj of objectsToInspect) {
    // Call the function to inspect and output a JSON file for each object
    await inspectAndOutput(obj);
  }

  // Exit the process with code 0
  process.exit(0);
});
