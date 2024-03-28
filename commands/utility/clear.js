const { SlashCommandBuilder } = require('discord.js');

module.exports = {
	cooldown: 5,
	data: new SlashCommandBuilder()
		.setName('clear')
		.setDescription('Clears messages in a channel.')
		.addIntegerOption(option =>
			option.setName('amount')
				.setDescription('The amount of messages to clear.')
				.setRequired(true)),
	async execute(interaction) {
		const amount = interaction.options.getInteger('amount');

		if (amount < 1 || amount > 100) {
			return interaction.reply({ content: 'You need to input a number between 1 and 100.', ephemeral: true });
		}

		await interaction.channel.bulkDelete(amount, true).catch(error => {
			console.error(error);
			interaction.reply({ content: 'There was an error trying to clear messages in this channel!', ephemeral: true });
		});

		await interaction.reply({ content: `Successfully cleared ${amount} messages.`, ephemeral: true });
	},
};