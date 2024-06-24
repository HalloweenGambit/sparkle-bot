import { loadGuilds } from "./utils";
import { Collection } from "discord.js";
import { findRowByTableAndId } from "./findRowByTableAndId";
import { Servers } from "../db/schema";

export const initialize = async () => {
  try {
    const allGuilds = await loadGuilds();
    await console.log("Fetched all guilds:", allGuilds);

    // if (allGuilds instanceof Collection) {
    //   for (const guild of allGuilds) {
    //     console.log("hello");
    //     const found = await findRowByTableAndId(Servers, guild[0]);
    //     if (!found) {
    //       console.log("hello");
    //       const newGuild = await loadGuilds(guild[0]);
    //       // const res = createServer(newGuild);
    //       console.log(`Added Guild: ${newGuild}`);
    //     }
    //   }
    // }
  } catch (error) {
    console.error("Error during initialization:", error);
  }
};
