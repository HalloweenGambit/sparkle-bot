import { afterEach, beforeEach, describe, expect, vi, test, it } from "vitest";
import discordClient from "../config/discordConfig.ts";
import dbClient from "../config/dbConfig.ts";
import { saveDiscordServers } from "../bot/services/saveDiscordServers.ts";
import { updateDiscordServers } from "../bot/services/updateDiscordServers.ts";
import { getDiscordServersFromAPI } from "../bot/services/getDiscordServers.ts";
import { mockGuildsFetch } from "../utils/discordMockData.js";
import { Guild, GuildFeature } from "discord.js";

// Mocking the Drizzle client
vi.mock("../config/dbConfig", () => ({
  default: {
    query: {
      Servers: {
        findFirst: vi.fn(async () => {
          const first = await mockGuildsFetch();
          return first[0];
        }),
      },
    },
    insert: vi.fn(() => ({
      values: vi.fn(),
    })),
    update: vi.fn(() => ({
      set: vi.fn().mockReturnThis(),
      where: vi.fn().mockReturnThis(),
      returning: vi
        .fn()
        .mockResolvedValue([{ res: "Server updated item promise" }]),
    })),
    find: vi.fn(),
  },
}));

vi.mock("../config/discordConfig", () => ({
  default: {
    guilds: {
      fetch: vi.fn(async (id?: string) => await mockGuildsFetch(id)),
    },
  },
}));

describe("Update operations for Discord servers", async () => {
  const update: Partial<Guild> = {
    id: "234567890123456789",
    name: "Server Update",
    description: "An updated server",
  };
  await updateDiscordServers(update);

  it("queries the db to see if the server exists", async () => {
    // check that the id property is the property bing
    expect(dbClient.query.Servers.findFirst).toHaveBeenCalledTimes(1);
    expect(dbClient.update).toHaveBeenCalled();
  });

  it.todo("updates");

  it.todo("should save server channels to the database");
  it.todo("should update server channels in the database");
  it.todo("should delete server channels from the database");
});
