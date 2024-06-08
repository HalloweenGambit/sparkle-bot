import { SlashCommandBuilder } from "discord.js";
import askDoc from "../integrations/gemini-pro.js";

export default {
  /** */
  data: new SlashCommandBuilder()
    .setName("hey doc")
    .setDescription("doc brown responds!"),
  async execute(interaction) {
    const response = await askDoc(interaction.data);
    await interaction.reply(response);
  },
};
