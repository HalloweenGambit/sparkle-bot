export default (client) => {
    client.on('interactionCreate', async (interaction) => {
        // if (!interaction.isCommand()) return
        const { commandName } = interaction;
        const command = client.commands.get(commandName);
        if (!command) {
            return await interaction.reply({
                content: 'Command not found!',
                ephemeral: true,
            });
        }
        try {
            await command.execute(interaction);
        }
        catch (error) {
            console.error(error);
            await interaction.reply({
                content: 'There was an error while executing this command!',
                ephemeral: true,
            });
        }
    });
};
