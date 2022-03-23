const Guild = require("../../discordToolsBox/guild");
const GuildMember = require("../../discordToolsBox/guildMember");
const Channel = require("../../discordToolsBox/channel");
const Message = require("../../discordToolsBox/message");
const MessageReaction = require("../../discordToolsBox/messageReaction");


module.exports.addReaction = async (client, messageReaction, messageData, user, userData) => {
    MessageReaction.removeAUser(messageReaction, user.id)

    const channel = messageReaction.message.channel;
    const guild = messageReaction.message.guild;
    const member = await Guild.fetchMembers(guild, user.id);
    if (!await GuildMember.hasPermission(member, "ADMINISTRATOR")) {
        Channel.send(messageReaction.message.channel, "<@" + user.id + ">, tu n'est pas autorisé à utiliser cette commande 😊", (msg) => {
            const timeoutObj = setTimeout(() => {
                Message.delete(msg);
            }, 3000);
            client.timeoutList.push(timeoutObj);
        })
        return;
    }
    client.basicFunctions.get("stopProgram").stop(client, channel);
}

module.exports.removeReaction = async (client, messageReaction, messageData, user, userData) => {}

module.exports.help = {
    name: "index"
};