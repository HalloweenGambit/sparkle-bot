import { describe, it, expect, beforeEach, afterEach, assert } from "vitest";
import {
  loadGuild,
  loadGuilds,
  loadCompleteGuilds,
  formatGuild,
} from "../utils/utils";
import DotenvFlow from "dotenv-flow";
import discordClient from "../config/discordConfig";
import { Collection } from "discord.js";
import dbClient from "../config/dbConfig";
import { findGuild } from "../utils/dbUtils";

DotenvFlow.config();

describe.skip("initialize", async () => {
  await dbClient;
  await discordClient.login(process.env.DISCORD_TOKEN);
  discordClient.once("ready", () => {
    console.log("test discordClient logged in");
  });

  beforeEach(async () => {
    //   await discordClient.login(process.env.DISCORD_TOKEN);
    //   discordClient.once("ready", () => {
    //     console.log("test discordClient logged in");
    //   });
  });

  afterEach(async () => {
    //   if (discordClient.isReady()) {
    //     await discordClient.destroy();
    //     console.log("test discordClient logged out");
    //   }
  });

  it("gets all of the active discord servers", async () => {
    const guilds = await loadGuilds();
    // console.log(guilds);
    expect(guilds).toBeInstanceOf(Collection); // Use toBeInstanceOf instead of toBe
  });

  it("check if the object is different when not part of guild[]", async () => {
    const guild = await loadGuild("1008463449594007692");
    expect(guild.id).toBe("1008463449594007692");
  });

  it("get details guild array", async () => {
    const allGuilds = await loadCompleteGuilds();
    expect(await allGuilds[0].id).toBeTruthy();
  });

  it("format guild", async () => {
    const guild = await loadCompleteGuilds();
    const testGuild = await guild[0];
    const formattedGuild = await formatGuild(testGuild);
    console.log(`formattedGuild: ${formattedGuild}`);
    expect(formattedGuild.guildName).toBeTypeOf("string");
  });

  it("check if guild exists in db", async () => {
    const guild = await loadCompleteGuilds();
    const testGuild = await guild[0];
    const formattedGuild = await formatGuild(testGuild);
    assert.isString(formattedGuild.discordId, "discordId is string");
    const guildId = await formattedGuild.discordId;
  });

  it.skip("return guild", async () => {
    const res = await findGuild();
    console.log(res);
    expect(res?.serverName).toBe("test guild");
  });

  it.only("create all guilds", async () => {
    const guild = await loadCompleteGuilds();
  });
  it.todo("");
  it.todo("");
  it.todo("");
});
