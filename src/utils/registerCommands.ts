import { REST } from "@discordjs/rest";
import { Routes } from "discord-api-types/v10";

// ! restructure reconsider using rest api

export const registerCommands = async (client) => {
  const commands = [];

  // Extract commands from the collection
  client.commands.forEach((command) => {
    commands.push(command.data.toJSON());
  });

  const rest = new REST({ version: "10" }).setToken(client.token);

  try {
    console.log("Started deleting all existing application (/) commands.");

    // Delete all existing commands
    await rest.put(Routes.applicationCommands(client.user.id), { body: [] });

    console.log("Successfully deleted all existing application (/) commands.");

    console.log("Started refreshing application (/) commands.");

    // Register new commands
    await rest.put(Routes.applicationCommands(client.user.id), {
      body: commands,
    });

    console.log("Successfully registered application (/) commands.");
  } catch (error) {
    console.error(error);
  }
};
