import {
  Client,
  Interaction,
  ButtonInteraction,
  ButtonBuilder,
  ButtonStyle,
  ActionRowBuilder,
} from 'discord.js'

export default (client: Client) => {
  client.on('interactionCreate', async (interaction: Interaction) => {
    if (!interaction.isButton()) return

    const onButton = new ButtonBuilder()
      .setCustomId('switch_on')
      .setLabel('On')
      .setStyle(ButtonStyle.Success)

    const offButton = new ButtonBuilder()
      .setCustomId('switch_off')
      .setLabel('Off')
      .setStyle(ButtonStyle.Secondary)

    const row = new ActionRowBuilder<ButtonBuilder>()

    if (interaction.customId === 'switch_on') {
      onButton.setStyle(ButtonStyle.Success)
      offButton.setStyle(ButtonStyle.Secondary)
    } else if (interaction.customId === 'switch_off') {
      onButton.setStyle(ButtonStyle.Secondary)
      offButton.setStyle(ButtonStyle.Danger)
    }

    row.addComponents(onButton, offButton)

    await interaction.update({
      content: 'Click a button to switch:',
      components: [row],
    })
  })
}
