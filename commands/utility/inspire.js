const { SlashCommandBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('inspire')
		.setDescription('Replies with an inspirational quote.'),
	async execute(interaction) {
		const quote = await get_quote();
		await interaction.reply(quote);
	},
};

async function get_quote() {
	try {
		const fetch = await import('node-fetch');
		const response = await fetch.default('https://zenquotes.io/api/random');
		const data = await response.json();
		return data[0]['q'] + ' - ' + data[0]['a'];
	} catch (error) {
		console.error('Error fetching quote:', error);
		return 'An error occurred while fetching the quote.';
	}
}