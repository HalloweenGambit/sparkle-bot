jest.mock("discord.js", () => {
  const originalModule = jest.requireActual("discord.js");
  return {
    ...originalModule,
    Client: jest.fn().mockImplementation(() => ({
      guilds: {},
      channels: {
        fetch: jest.fn(),
      },
    })),
    TextChannel: jest.fn().mockImplementation(() => ({
      messages: {
        fetchPinned: jest.fn(),
      },
      isTextBased: jest.fn(),
    })),
  };
});

describe("My stack", () => {
  it("gets all channel ids", () => {});
  it.todo("gets all channel pinned comments");
  it.todo("gets a specific channelIds pinned comments");
});
