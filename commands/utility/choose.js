const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('choose')
        .setDescription('Fait un choix aléatoire parmi plusieurs options.')
        .addStringOption(option =>
            option.setName('options')
                .setDescription('Les choix possibles, séparés par des virgules (ex: Pizza, Burger, Tacos)')
                .setRequired(true)),
    async execute(interaction) {
        const rawInput = interaction.options.getString('options');
        const choices = rawInput.split(',').map(choice => choice.trim()).filter(Boolean);

        if (choices.length < 2) {
            return interaction.reply({
                content: 'Donne au moins 2 options séparées par des virgules.',
                ephemeral: true,
            });
        }

        const picked = choices[Math.floor(Math.random() * choices.length)];
        await interaction.reply(`🎲 J'ai choisi : **${picked}**`);
    },
};