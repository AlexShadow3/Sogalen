const { SlashCommandBuilder } = require('discord.js');

module.exports = {
	cooldown: 5,
	data: new SlashCommandBuilder()
		.setName('roll')
		.setDescription('Rolls a dice'),
	async execute(interaction) {
		const roll = Math.floor(Math.random() * 6) + 1;
		await interaction.reply(`You rolled a ${roll}`);
	},
};