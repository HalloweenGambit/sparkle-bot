import { vi, test, describe, it, expect } from "vitest";
import { loadGuild, loadGuilds, loadCompleteGuilds } from "../utils/loadGuilds";
import DotenvFlow from "dotenv-flow";
import { beforeEach } from "node:test";
import discordClient from "../config/discordConfig";
import { Collection } from "discord.js";

DotenvFlow.config();

describe("initialize", () => {
  beforeEach(async () => {
    await discordClient.login(process.env.DISCORD_TOKEN);
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
    expect(await allGuilds[0]).toBeTruthy();
  });

  it.todo("");
  it.todo("");
  it.todo("");
  it.todo("");
  it.todo("");
  it.todo("");
});
