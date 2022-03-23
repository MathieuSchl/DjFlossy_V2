const Interaction = require("../../discordToolsBox/interaction");


module.exports.run = async (client, interaction) => {
    await Interaction.editReply(interaction, {
        content: 'Pong!'
    });
}


module.exports.help = {
    name: "index",
    ephemeral: true
};