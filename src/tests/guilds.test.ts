// tests/initialize.test.ts

import { describe, it, expect, beforeEach } from "vitest";
import { loadCompleteGuilds, formatGuild } from "../utils/utils";
import dbClient from "../config/dbConfig";
import DotenvFlow from "dotenv-flow";
import { findGuild } from "../utils/dbUtils";
import discordClient from "../config/discordConfig";

DotenvFlow.config();

describe.skip("find guild", async () => {
  await dbClient;
  await discordClient.login(process.env.DISCORD_TOKEN);
  discordClient.once("ready", () => {
    console.log("test discordClient logged in");
  });

  it("return guild", async () => {
    const res = await findGuild();
    console.log(res);
    expect(res?.serverName).toBe("test guild");
  });

  it("", async () => {});

  it("check if guild exists in db", async () => {});
});
