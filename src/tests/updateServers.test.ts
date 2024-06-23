import { afterEach, beforeEach, describe, expect, vi, test, it } from "vitest";
import dbClient from "../config/dbConfig.ts";
import { updateServerDetails } from "../bot/services/updateServerDetails.ts";
import { mockGuildsFetch } from "../utils/discordMockData.js";
import { Guild, GuildFeature } from "discord.js";
import { Servers } from "../db/schema.ts";

// Mocking the Drizzle client
vi.mock("../config/dbConfig", () => ({
  default: {
    query: {
      Servers: {
        findFirst: vi.fn(async (id) => {
          id;
        }),
      },
    },
    update: vi.fn(() => {}),
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
  it("calls the update function with the update", () => {
    updateServerDetails({ id: "123456789012345678" });
    expect(dbClient.query.Servers.findFirst).toHaveBeenCalled();
  });
});
