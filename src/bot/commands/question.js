import { SlashCommandBuilder } from "@discordjs/builders";

export default {
  data: new SlashCommandBuilder()
    .setName("ping")
    .setDescription("Replies with Pong!"),
  async execute(interaction) {
    await interaction.reply("Pong!");
  },
};

// src/bot/eventListeners/handlers.js
export async function handleMessageCreate(message, dbClient, gptClient) {
  const content = message.content;
  const guildId = message.guildId;
  const channelId = message.channelId;
  const createdAt = message.createdAt;

  const containsQuestionMark = (str) => {
    const regex = /\?/;
    return regex.test(str);
  };

  if (!containsQuestionMark(content)) {
    return false;
  }

  console.log(content);
  return;
}
