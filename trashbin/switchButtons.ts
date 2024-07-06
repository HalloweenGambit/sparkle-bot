import { SlashCommandBuilder } from '@discordjs/builders'
import {
  CommandInteraction,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
} from 'discord.js'

export default {
  data: new SlashCommandBuilder()
    .setName('switch-buttons')
    .setDescription('Switch between two buttons'),

  async execute(interaction: CommandInteraction) {
    const onButton = new ButtonBuilder()
      .setCustomId('switch_on')
      .setLabel('On')
      .setStyle(ButtonStyle.Success)

    const offButton = new ButtonBuilder()
      .setCustomId('switch_off')
      .setLabel('Off')
      .setStyle(ButtonStyle.Secondary)

    const row = new ActionRowBuilder<ButtonBuilder>().addComponents(
      onButton,
      offButton
    )

    await interaction.reply({
      content: 'Click a button to switch:',
      components: [row],
      ephemeral: true,
    })
  },
}
