import { vi, describe, it, expect, beforeEach, afterEach } from "vitest";
import { loadCompleteGuilds, formatGuild, findGuild } from "../utils/utils";
import DotenvFlow from "dotenv-flow";
import discordClient from "../config/discordConfig";
import dbClient from "../config/dbConfig";

DotenvFlow.config();

describe("initialize", async () => {
  await dbClient;
  console.log(dbClient);

  //   console.log(discordClient);
  beforeEach(async () => {
    // Additional setup can be added here if needed
  });

  afterEach(async () => {
    // if (discordClient.isReady()) {
    //   await discordClient.destroy();
    //   console.log("test discordClient logged out");
    // }
  });

  it.only("check if guild exists in db", async () => {
    const guilds = await loadCompleteGuilds();
    const testGuild = guilds[0];
    const formattedGuild = await formatGuild(testGuild);
    const guildId = formattedGuild.discordId;
    console.log(guildId);
    const checkGuild = await findGuild(guildId);
    console.log(checkGuild);
    expect(checkGuild).toBeTypeOf("string");

    const noGuild = await findGuild("invalidId");
    expect(noGuild).toBeNull();
  });
});
