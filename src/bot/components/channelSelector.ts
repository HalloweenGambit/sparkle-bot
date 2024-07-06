import { Guild, ActionRowBuilder, ButtonBuilder, ButtonStyle } from 'discord.js'
import { loadGuildChannels } from '../../utils/channelUtils'

export const channelSelector = async (
  guild: Guild
): Promise<ActionRowBuilder[]> => {
  const guildChannels = await loadGuildChannels(guild)

  const rows: ActionRowBuilder[] = guildChannels.map((channel) => {
    const selectButton = new ButtonBuilder()
      .setCustomId(`select_${channel.id}`)
      .setLabel(`Select`)
      .setStyle(ButtonStyle.Secondary)

    const deselectButton = new ButtonBuilder()
      .setCustomId(`deselect_${channel.id}`)
      .setLabel(`Deselect`)
      .setStyle(ButtonStyle.Secondary)

    const channelButton = new ButtonBuilder()
      .setCustomId(`channel_${channel.id}`)
      .setLabel(channel.name)
      .setStyle(ButtonStyle.Secondary)

    const row = new ActionRowBuilder().addComponents(
      selectButton,
      deselectButton,
      channelButton
    )

    return row
  })

  return rows
}
