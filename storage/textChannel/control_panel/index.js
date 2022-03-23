const textChannelType = "control_panel";


module.exports.run = (client, message, channelData, userData) => {
    client.textChannel[textChannelType].get("reload").run(client, message, channelData, userData);
}

module.exports.help = {
    name: "index"
};