import { afterEach, beforeEach, describe, expect, vi, test } from "vitest";
import discordClient from "../config/discordConfig.ts";
import {
  getDiscordServersFromAPI,
  saveServers,
} from "../bot/services/getDiscordServers.ts";
import { mockGuildsFetch } from "./discordMockData.js";

// Automocking the Drizzle client
vi.mock("../config/dbConfig");
vi.mock("../config/discordConfig", () => ({
  default: {
    guilds: {
      fetch: vi.fn(async (id?: string) => await mockGuildsFetch(id)),
    },
  },
}));

describe("crud operations", () => {
  beforeEach(() => {
    // Reset mocks before each test
    vi.clearAllMocks();
  });

  test("getting all discord channels", async () => {
    const res = await getDiscordServersFromAPI();
    await expect(res).toHaveLength(3);
  });

  test("get a specific discord channel", async () => {
    const id = "234567890123456789";
    const guild = await getDiscordServersFromAPI(id);
    expect(guild.id).toBe(id);
  });

  test("save all discord servers to database", async () => {
    const guilds = await getDiscordServersFromAPI();
  });
});

// need discordClient
// get all discord servers
// get all associated discord channels
// check if all discord servers are recorded in the database
// check if all discord channels are recorded and linked to the servers
// if new discord is added > add to database
// if discord channel is removed > add an inactive flag to the discord db record
// create a mock of dbClient to pretend to write and query our database
// create a mock of discordjs to pretend to write and query our database
