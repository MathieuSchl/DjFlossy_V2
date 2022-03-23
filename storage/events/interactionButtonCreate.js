const Interaction = require("../discordToolsBox/interaction");


module.exports.run = async (client, interaction) => {

    try {
        const action = client.button[interaction.customId].get("index");
        await Interaction.deferReply(interaction, {
            ephemeral: action.help.ephemeral
        })
        client.button[interaction.customId].get("index").run(client, interaction);
    } catch (e) {
        console.log("button '" + interaction.customId + "' doesn't exist");
    }
}

module.exports.help = {
    name: "interactionButtonCreate"
};