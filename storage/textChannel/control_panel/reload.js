const Channel = require("../../discordToolsBox/channel");
const Message = require("../../discordToolsBox/message");
const textChannelType = "control_panel";


module.exports.reload = async (client, channel, language) => {
    if (!language) {
        return;
    }

    const messageData = client.textChannel.control_panel.get("getMessage").commandPannel.message(language);
    messageData.components = client.textChannel.control_panel.get("getMessage").commandPannel.actionRow(language);

    const messagesColl = await Channel.messagesFetch(channel);
    const messages = Array.from(messagesColl);

    if (messagesColl.size !== 1 || messages[0][1].author.id !== client.user.id) {
        if (messagesColl.size !== 0) await client.discordToolsBox.get("channel").deleteAll(client, channel);

        Channel.send(channel, messageData, (msg) => {
            client.dataBase.get("message").insert(client, {
                "v_id": msg.id,
                "v_idChannel": channel.id,
                "v_idGuild": channel.guild.id,
                "v_language":language,
                "v_category_mess": "textChannel",
                "v_type_mess": "control_panel",
                "v_name_mess": "commandPannel",
                "v_emoji": [],
                "v_type": [],
                "v_data": {}
            }, (error) => {
                if (error) console.log(error);
            })
        })
        return;
    } else {
        await Message.edit(messages[0][1], messageData);
    }
}

module.exports.run = async (client, message, channelData, userData) => {
    try {
        const channel = message.channel;
        await Message.delete(message);
        client.textChannel[textChannelType].get("reload").reload(client, channel, channelData.v_language);
    } catch (e) {
        console.log(e);
    }
}

module.exports.help = {
    name: "reload"
};