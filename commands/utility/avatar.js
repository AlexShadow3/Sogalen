const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('avatar')
        .setDescription("Affiche l'avatar d'un utilisateur en grand format.")
        .addUserOption(option =>
            option.setName('target')
                .setDescription("L'utilisateur ciblé")
                .setRequired(false)),
    async execute(interaction) {
        const user = interaction.options.getUser('target') || interaction.user;
        const avatarUrl = user.displayAvatarURL({ size: 1024, dynamic: true });

        const embed = new EmbedBuilder()
            .setTitle(`Avatar de ${user.username}`)
            .setImage(avatarUrl)
            .setColor(0x5865F2)
            .setDescription(`[Lien direct vers l'image](${avatarUrl})`);

        await interaction.reply({ embeds: [embed] });
    },
};