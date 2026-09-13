const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('remind')
        .setDescription('Programme un rappel.')
        .addIntegerOption(option =>
            option.setName('minutes')
                .setDescription('Délai en minutes')
                .setRequired(true)
                .setMinValue(1)
                .setMaxValue(1440))
        .addStringOption(option =>
            option.setName('message')
                .setDescription('Message du rappel')
                .setRequired(true)),
    async execute(interaction) {
        const minutes = interaction.options.getInteger('minutes');
        const message = interaction.options.getString('message');
        const ms = minutes * 60 * 1000;

        await interaction.reply({
            content: `⏰ C'est noté ! Je te rappellerai : "${message}" dans **${minutes} minute(s)**.`,
            ephemeral: true,
        });

        setTimeout(async () => {
            try {
                await interaction.user.send(`🔔 **Rappel :** ${message}`);
            } catch {
                await interaction.channel.send(`🔔 ${interaction.user}, **Rappel :** ${message}`);
            }
        }, ms);
    },
};