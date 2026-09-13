const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('weather')
        .setDescription('Affiche la météo actuelle pour une ville donnée.')
        .addStringOption(option =>
            option.setName('ville')
                .setDescription('Nom de la ville')
                .setRequired(true)),
    async execute(interaction) {
        const city = interaction.options.getString('ville');
        await interaction.deferReply();

        try {
            const response = await fetch(`https://wttr.in/${encodeURIComponent(city)}?format=j1`);
            if (!response.ok) throw new Error('Ville introuvable');

            const data = await response.json();
            const current = data.current_condition[0];
            const area = data.nearest_area[0]?.areaName[0]?.value || city;

            const embed = new EmbedBuilder()
                .setTitle(`Météo à ${area}`)
                .setColor(0x00A8FC)
                .addFields(
                    { name: 'Condition', value: current.lang_fr?.[0]?.value || current.weatherDesc[0].value, inline: true },
                    { name: 'Température', value: `${current.temp_C} °C (ressenti ${current.FeelsLikeC} °C)`, inline: true },
                    { name: 'Humidité', value: `${current.humidity} %`, inline: true },
                    { name: 'Vent', value: `${current.windspeedKmph} km/h`, inline: true },
                );

            await interaction.editReply({ embeds: [embed] });
        } catch {
            await interaction.editReply({ content: `Impossible de récupérer la météo pour "${city}".` });
        }
    },
};