const discord = require('discord.js')
module.exports = async (interaction, errorString) => {
    const embed = new discord.EmbedBuilder()
        .setColor('#E02A6B')
        .setTitle('An Error Occurred')
        .setDescription(errorString)
    return interaction.editReply({ content: '', embeds: [embed] })
}