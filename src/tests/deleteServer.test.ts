import { Guild } from "discord.js";
import { beforeEach, vi, describe, it, expect } from "vitest";
import { deleteServer } from "../bot/services/deleteServer";
import dbClient from "../config/dbConfig";

// Mocking the Drizzle client
vi.mock("../config/dbConfig", () => ({
  default: {
    query: {
      Servers: {
        findFirst: vi
          .fn((a) => {
            a;
          })
          .mockResolvedValue(a),
      },
    },
    update: vi.fn(() => {}),
  },
}));

describe("delete server from db", () => {
  it("finds the server in the database", () => {
    const serverId = "1234567890";
    deleteServer(serverId);
    expect(dbClient.query.Servers.findFirst()).toHaveBeenCalledWith(serverId);
  });
});
