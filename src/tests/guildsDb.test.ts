import { describe, it, expect, beforeEach } from "vitest";
import DotenvFlow from "dotenv-flow";
import dbClient from "../config/dbConfig";
import { findGuild, createGuild } from "../utils/utils";

DotenvFlow.config();

describe.skip("create all discord guilds", async () => {
  // get all guilds from discord api
  // format all of them and return them as a formatted list
  // use the formatted list to
  it("", async () => {
    const res = await createGuild({
      discordId: "098761929987",
      serverName: "4 test guild",
      serverOwnerId: "123454321",
    });
    await console.log(res);
    expect(res).toBe("?");
  });

  it("find Server record", async () => {
    // create fake guild
    const res = await findGuild("1234567890");
    console.log(res);
    // expect(res?.serverName).toBe("test guild");
  });

  it("check if guild exists in db", async () => {});
});
