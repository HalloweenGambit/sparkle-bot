import { vi } from "vitest";

export const mockGuildsFetch = vi.fn(async (id?: string) => {
  const servers = [
    {
      id: "123456789012345678",
      name: "Server 1",
      icon: "server1-icon-hash",
      ownerID: "987654321098765432",
      memberCount: 25,
      createdAt: new Date("2023-06-18T12:00:00.000Z"),
      region: "us-east",
    },
    {
      id: "234567890123456789",
      name: "Server 2",
      icon: "server2-icon-hash",
      ownerID: "876543210987654321",
      memberCount: 18,
      createdAt: new Date("2023-06-19T10:30:00.000Z"),
      region: "eu-central",
    },
    {
      id: "345678901234567890",
      name: "Server 3",
      icon: "server3-icon-hash",
      ownerID: "765432109876543210",
      memberCount: 30,
      createdAt: new Date("2023-06-20T08:45:00.000Z"),
      region: "asia-southeast",
    },
  ];

  if (id) {
    return servers.find((server) => server.id === id) || null; // Return the server with matching id or null if not found
  }

  return servers; // Return all servers if no id is provided
});

export const mockDiscordMessage = vi.fn(
  (
    content = "Is this project open source?",
    reply = "yes it is, here are the links"
  ) => {
    return {
      // returns Snowflake
      id: Math.floor(Math.random() * 10000),
      // Returns text
      content: content,
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
