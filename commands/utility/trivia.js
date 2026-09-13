const {
    SlashCommandBuilder,
    EmbedBuilder,
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle,
    ComponentType,
} = require('discord.js');

// Décode les entités HTML (ex: &quot;, &#039;) renvoyées par l'API
function decodeHtml(html) {
    return html
        .replace(/&quot;/g, '"')
        .replace(/&#039;/g, "'")
        .replace(/&amp;/g, '&')
        .replace(/&lt;/g, '<')
        .replace(/&gt;/g, '>');
}

module.exports = {
    data: new SlashCommandBuilder()
        .setName('trivia')
        .setDescription('Pose une question de culture générale avec boutons.'),
    async execute(interaction) {
        await interaction.deferReply();

        try {
            const res = await fetch('https://opentdb.com/api.php?amount=1&type=multiple');
            const data = await res.json();

            if (!data.results || data.results.length === 0) {
                return interaction.editReply('Impossible de charger une question pour le moment.');
            }

            const q = data.results[0];
            const correctAnswer = decodeHtml(q.correct_answer);
            const choices = [...q.incorrect_answers.map(decodeHtml), correctAnswer]
                .sort(() => Math.random() - 0.5);

            const buttons = choices.map((choice, i) =>
                new ButtonBuilder()
                    .setCustomId(`trivia_${i}`)
                    .setLabel(choice.slice(0, 80))
                    .setStyle(ButtonStyle.Primary)
            );

            const row = new ActionRowBuilder().addComponents(buttons);

            const embed = new EmbedBuilder()
                .setTitle(`Trivia : ${decodeHtml(q.category)}`)
                .setDescription(decodeHtml(q.question))
                .setColor(0xFEE75C)
                .setFooter({ text: 'Tu as 20 secondes pour répondre !' });

            const response = await interaction.editReply({ embeds: [embed], components: [row] });

            const collector = response.createMessageComponentCollector({
                componentType: ComponentType.Button,
                time: 20_000,
            });

            collector.on('collect', async i => {
                const clickedLabel = choices[parseInt(i.customId.replace('trivia_', ''), 10)];
                const isCorrect = clickedLabel === correctAnswer;

                const disabledButtons = buttons.map((btn, idx) => {
                    const val = choices[idx];
                    if (val === correctAnswer) return btn.setStyle(ButtonStyle.Success).setDisabled(true);
                    if (!isCorrect && val === clickedLabel) return btn.setStyle(ButtonStyle.Danger).setDisabled(true);
                    return btn.setStyle(ButtonStyle.Secondary).setDisabled(true);
                });

                const endRow = new ActionRowBuilder().addComponents(disabledButtons);

                await i.update({
                    content: isCorrect
                        ? ` Bravo ${i.user}, bonne réponse !`
                        : ` Raté ${i.user} ! La bonne réponse était **${correctAnswer}**.`,
                    components: [endRow],
                });
                collector.stop('answered');
            });

            collector.on('end', async (_, reason) => {
                if (reason !== 'answered') {
                    const disabledRow = new ActionRowBuilder().addComponents(
                        buttons.map(b => b.setDisabled(true))
                    );
                    await interaction.editReply({
                        content: `⏳ Temps écoulé ! La réponse était **${correctAnswer}**.`,
                        components: [disabledRow],
                    });
                }
            });
        } catch {
            await interaction.editReply('Erreur lors de la récupération du quiz.');
        }
    },
};