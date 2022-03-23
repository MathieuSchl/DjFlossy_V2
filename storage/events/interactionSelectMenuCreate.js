module.exports.run = async (client, interaction) => {

    try {
        client.selectMenu[interaction.customId].get("index").run(client, interaction);
    } catch (e) {
        console.log(client.selectMenu);
        console.log("selectMenu '" + interaction.customId + "' doesn't exist");
    }
}

module.exports.help = {
    name: "interactionSelectMenuCreate"
};