import dbClient from "../../config/dbConfig";
import { Servers } from "../../db/schema";
import { Guild } from "discord.js";
import {
  compareGuilds,
  formatGuild,
  loadCompleteGuilds,
} from "../../utils/utils";
import { findGuild, createGuild } from "../../utils/utils";

// Function to format Discord Guild object into Server type
type Server = typeof Servers.$inferInsert;

export const initializeServers = async () => {
  try {
    // get all guilds from discord api
    const allCompleteGuilds = await loadCompleteGuilds();
    console.log("Comparing current database against discords API");

    for (const completeGuild of allCompleteGuilds) {
      // see if its in the database
      const storedGuild = await findGuild(completeGuild.id);
      const guild = formatGuild(completeGuild);

      // if not create it
      if (!storedGuild) {
        console.log(`Guild ${guild.guildName} (${guild.discordId}) created.`);
        return await createGuild(guild);
      }
      // check if
      if (compareGuilds(guild, storedGuild)) {
        console.log(
          `Guild ${guild.guildName} (${guild.discordId} was found and is upto date`
        );
        return {};
      }

      // ! currently updating everything and not logging what is changing
      // TODO: handle memberCount changes > track changes
      console.log(
        `Guild ${guild.guildName} (${guild.discordId}) found, comparing essential fields for updates`
      );
      const res = update(guild);
    }
    return allCompleteGuilds;
  } catch (error) {
    console.error("Error initializing servers:", error);
    throw error;
  }
};
