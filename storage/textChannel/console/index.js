const Message = require("../../discordToolsBox/message");
const textChannelType = "console";


module.exports.run = async (client, message, channelData, userData) => {
    try {
        const channel = message.channel;
        await Message.delete(message);
        client.textChannel[textChannelType].get("reload").reload(client, channel);
    } catch (error) {
        console.log("error in textChannel '" + textChannelType + "'");
        console.log(error);
    }
}

module.exports.help = {
    name: "index"
};