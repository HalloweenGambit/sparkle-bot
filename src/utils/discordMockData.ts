import { vi } from "vitest";
import { Guild } from "discord.js"; // Import Guild type from discord.js

// Define a mock function to fetch guilds
export const mockGuildsFetch = vi.fn(async (id?: string) => {
  const servers = [
    {
      id: "123456789012345678",
      name: "Server 1",
      icon: "server1-icon-hash",
      description: "A fun server",
      ownerID: "987654321098765432",
      features: ["COMMUNITY", "NEWS"],
      createdAt: new Date("2023-06-18T12:00:00.000Z"),
      approximate_member_count: 25,
      verification_level: "HIGH",
      preferred_locale: "en-US",
      nsfw_level: "SAFE",
    },
    {
      id: "234567890123456789",
      name: "Server 2",
      icon: "server2-icon-hash",
      description: "A tech server",
      ownerID: "876543210987654321",
      features: ["DISCOVERABLE", "NEWS"],
      createdAt: new Date("2023-06-19T10:30:00.000Z"),
      approximate_member_count: 18,
      verification_level: "MEDIUM",
      preferred_locale: "en-GB",
      nsfw_level: "NSFW",
    },
    {
      id: "345678901234567890",
      name: "Server 3",
      icon: "server3-icon-hash",
      description: "A gaming server",
      ownerID: "765432109876543210",
      features: ["COMMUNITY", "PARTNERED"],
      createdAt: new Date("2023-06-20T08:45:00.000Z"),
      approximate_member_count: 30,
      verification_level: "VERY_HIGH",
      preferred_locale: "fr-FR",
      nsfw_level: "AGE_RESTRICTED",
    },
    {
      id: "456789012345678901",
      name: "Server 4",
      icon: "server4-icon-hash",
      description: "A study server",
      ownerID: "654321098765432109",
      features: ["ANIMATED_ICON", "VANITY_URL"],
      createdAt: new Date("2023-06-21T07:15:00.000Z"),
      approximate_member_count: 12,
      verification_level: "NONE",
      preferred_locale: "es-ES",
      nsfw_level: "SAFE",
    },
    {
      id: "567890123456789012",
      name: "Server 5",
      icon: "server5-icon-hash",
      description: "A music server",
      ownerID: "543210987654321098",
      features: ["WELCOME_SCREEN_ENABLED", "NEWS"],
      createdAt: new Date("2023-06-22T06:00:00.000Z"),
      approximate_member_count: 40,
      verification_level: "LOW",
      preferred_locale: "de-DE",
      nsfw_level: "SAFE",
    },
  ];

  // Map servers array to Guild objects with selected parameters
  const guilds: Guild[] = servers.map((server) => ({
    id: server.id,
    name: server.name,
    icon: server.icon,
    description: server.description,
    ownerID: server.ownerID,
    features: server.features,
    createdAt: server.createdAt,
    approximate_member_count: server.approximate_member_count,
    verification_level: server.verification_level,
    preferred_locale: server.preferred_locale,
    nsfw_level: server.nsfw_level,
  }));

  if (id) {
    return guilds.find((guild) => guild.id === id) || null; // Return the guild with matching id or null if not found
  }

  return guilds; // Return all guilds if no id is provided
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
