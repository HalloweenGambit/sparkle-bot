import { channelSelector } from '../src/bot/components/channelSelector'
import { Interaction } from 'discord.js'
import { SlashCommandBuilder } from '@discordjs/builders'
import discordClient from '../src/config/discordConfig'

export default {
  data: new SlashCommandBuilder()
    .setName('setup-pinned-messages')
    .setDescription('Select which channels to get the pinned messages from'),

  async execute(interaction: Interaction) {
    if (!interaction.isCommand()) return
    if (!interaction.guild) return

    const rows = await channelSelector(interaction.guild)

    // Ensure only up to 5 components are included
    const components = rows.slice(0, 5).map((row) => row.toJSON())

    interaction.channel?.send({
      content: 'Fuck you',
      components: components, // Convert each row to JSON
    })

    await interaction.reply({
      content: 'Please choose your options:',
      components: components, // Convert each row to JSON
    })
  },
}
