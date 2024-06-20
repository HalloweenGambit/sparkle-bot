import dbClient from "../../config/dbConfig";
import discordClient from "../../config/discordConfig";

export const getDiscordServersFromAPI = async (id?) => {
  try {
    if (id === null || id === undefined) {
      return discordClient.guilds.fetch();
    }
    const discordServer = await discordClient.guilds.fetch(id);
    return discordServer;
  } catch (error) {
    console.error("Error fetching Discord servers:", error);
    throw error;
  }
};

export const saveServers = () => {
  // for each
  // get all discord servers ids
  // add new discords to database
  // if discord id is in db check if there are differences, if there are make changes

  const allServers = getDiscordServersFromAPI();
};
