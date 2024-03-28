const { SlashCommandBuilder } = require('discord.js');

module.exports = {
	cooldown: 5,
	data: new SlashCommandBuilder()
		.setName('hot')
		.setDescription('Replies with heads or tails!'),
	async execute(interaction) {
		const hot = Math.floor(Math.random() * 2) + 1;
		if (hot === 1) {
			await interaction.reply('You got heads!');
		} else {
			await interaction.reply('You got tails!');
		}
	},
};