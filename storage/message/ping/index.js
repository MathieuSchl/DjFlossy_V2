const Channel = require("../../discordToolsBox/channel");
const Message = require("../../discordToolsBox/message");
const MessageReaction = require("../../discordToolsBox/messageReaction");


module.exports.addReaction = async (client, messageReaction, messageData, user, userData) => {
    MessageReaction.removeAUser(messageReaction,user.id)

    Channel.send(messageReaction.message.channel, "ping", (msg) => {
        const timeoutObj = setTimeout(() => {
            Message.delete(msg);
        }, 5000);
        client.timeoutList.push(timeoutObj);
    });
}

module.exports.removeReaction = async (client, messageReaction, messageData, user, userData) => {}

module.exports.help = {
    name: "index"
};