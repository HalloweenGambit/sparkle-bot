import { afterEach, beforeEach, describe, expect, vi, test, it } from "vitest";
import discordClient from "../config/discordConfig.ts";
import dbClient from "../config/dbConfig.ts";
import { saveDiscordServers } from "../bot/services/saveDiscordServers.ts";
import { updateServerDetails } from "../bot/services/updateServerDetails.ts";
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
      returning: vi.fn().mockResolvedValue([{ res: "Server was updated" }]),
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

describe("CRUD operations for Discord servers", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should fetch all Discord servers", async () => {
    const res = await getDiscordServersFromAPI();
    expect(res).toHaveLength(5);
  });

  it("should fetch a specific Discord server by ID", async () => {
    const id = "234567890123456789";
    const guild = await getDiscordServersFromAPI(id);
    expect(guild.id).toBe(id);
  });

  it("should save servers to the database", async () => {
    const servers = await mockGuildsFetch();
    const db = dbClient;
    await saveDiscordServers(servers);
    expect(servers).toHaveLength(5);
    expect(dbClient.insert).toHaveBeenCalledTimes(1);
  });

  it("updates server on the database", async () => {
    const update: Partial<Guild> = {
      id: "234567890123456789",
      name: "Server Update",
      description: "An updated server",
    };

    // check that the id property is the property bing
    await updateServerDetails(update);
    expect(dbClient.query.Servers.findFirst).toHaveBeenCalledTimes(1);
    expect(dbClient.update).toHaveBeenCalled();
  });

  it.todo("updates");

  it.todo("should save server channels to the database");
  it.todo("should update server channels in the database");
  it.todo("should delete server channels from the database");
});
