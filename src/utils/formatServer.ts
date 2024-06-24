import { Guild } from "discord.js";

// Function to format Discord Guild object into Server type
export function formatGuild(guild: Guild) {
  return {
    discordId: guild.id,
    serverDescription: guild.description,
    features: guild.features,
    serverName: guild.name,
    serverOwnerId: guild.ownerId,
    verificationLevel: guild.verificationLevel,
    serverNsfwLevel: guild.nsfwLevel,
    approxMemberCount: guild.memberCount,
    createdAt: new Date(guild.createdAt),
  };
}
