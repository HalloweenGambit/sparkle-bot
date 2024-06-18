import { handleMessageCreate } from "../bot/eventListeners/handlers/handlers.js";
import dbClient from "../../config/dbConfig.js";
import gptClient from "../../../loaders/geminiProLoader.js";
import { describe, vi, test, expect } from "vitest";

// Function to create a mock message object
const mockDiscordMessage = vi.fn(
  (
    content = "Is this project open source?",
    reply = "yes it is, here are the links"
  ) => {
    return {
      // returns Snowflake
      id: Math.floor(Math.random() * 10000),
      // Returns text
      content: vi.fn(() => content),
      // returns Snowflake
      guildId: Math.floor(Math.random() * 10000),
      // returns Snowflake
      channelId: Math.floor(Math.random() * 10000),
      // returns Date object
      createdAt: new Date(),
      // returns user object
      author: {
        id: vi.fn(() => {
          Math.floor(Math.random() * 10000);
        }),
      },
      channel: "GuildTextBasedChannel",
      reply: (replyContent) => `Reply: ${replyContent}`,
    };
  }
);

vi.mock("../../config/dbConfig.js", async () => {
  return {
    default: { myDefaultKey: vi.fn() },
    namedExport: vi.fn(),
    // etc...
  };
});

vi.mock("../../../loaders/geminiProLoader.js", async () => {
  return {
    default: {
      myDefaultKey: vi.fn(() => {
        "Message from doc";
      }),
    },
  };
});

describe("Process a question", () => {
  test("Recieve a question", async () => {
    const msg = await mockDiscordMessage();
    const res = await handleMessageCreate(msg, dbClient, gptClient);
    expect(msg.content()).toBe("Is this project open source?");
  });

  test("get the useful info from the message received", async () => {
    // extract and return discordId, userId, and channelId, msg content,
    const msg = await mockDiscordMessage("Question?");
    const res = await handleMessageCreate(msg, dbClient, gptClient);
    // check message
    expect(msg.content).toBe("Question?");
    expect(msg.guildId).toBe();
  });

  test.todo("Record the discordID and message", async () => {
    const msg = await mockDiscordMessage("Question?");
    const res = await handleMessageCreate(msg, dbClient, gptClient);
    expect(res.dbClient).toBe(0);
  });

  test.todo("Send message to gpt", async () => {
    const msg = await mockDiscordMessage("Is this project open source??");
    const res = await handleMessageCreate(msg, dbClient, gptClient);
    expect(res.dbClient).toBe(0);
  });

  test.todo("Receive response", async () => {
    const msg = await mockDiscordMessage("Is this project open source??");
    const res = await handleMessageCreate(msg, dbClient, gptClient);
    expect(res.dbClient).toBe(0);
  });
});
