import DotenvFlow from "dotenv-flow";
import discordClient from "../../../index.js";

DotenvFlow.config({
  path: "../../../",
});

discordClient.once("ready", async () => {
  try {
    // const guildId = "1248436505479876700";

    const guild = await discordClient.guilds.fetch("1248436505479876700");
    const channels = await guild.channels.fetch();

    channels.forEach((channel) => {
      console.log(`${channel.name} - ${channel.type}`);
    });
  } catch (error) {
    console.error("Error fetching channels:", error);
  }
});

// // Wait for the client to be fully ready
// discordClient.once("ready", async () => {
//   // Get the guild by its ID
//   const guildId = "1248436505479876700";
//   const guild = discordClient.guilds.cache.get(guildId);

//   if (!guild) {
//     console.error(`Guild with ID ${guildId} not found.`);
//     return;
//   }

//   // Get the channels of the guild
//   const channels = guild.channels.cache;

//   // Log the IDs of all the channels in the guild
//   channels.forEach((channel) => {
//     console.log(channel.id);
//   });
// });
