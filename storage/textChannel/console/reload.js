const fs = require("fs");
const Channel = require("../../discordToolsBox/channel");
const Message = require("../../discordToolsBox/message");

module.exports.reload = async (client, channel) => {
    fs.readFile(client.location + "ConsoleFile.txt", 'utf8', async function (err, data) {
        if (err) {
            Channel.send(channel, "The console file does not exist");
            return;
        }

        const messagesToSendList = [];
        const dataSplit = data.split("\n");
        let msg = "";
        for (let index = 0; index < dataSplit.length; index++) {
            const element = dataSplit[index];
            if (msg.length + element.length <= 1900) {
                msg = msg + element + "\n";
            } else {
                messagesToSendList.push("```\n" + msg + "```")
                msg = element + "\n";
            }
        }
        messagesToSendList.push("```\n" + msg + "```")

        let messageSendedList = Array.from(await Channel.messagesFetch(channel));
        if (messageSendedList.length > messagesToSendList.length) {
            await client.discordToolsBox.get("channel").deleteAll(client, channel);
            messageSendedList = [];
        }else messageSendedList.reverse();

        for (let index = 0; index < messagesToSendList.length; index++) {
            const elementToSend = messagesToSendList[index];
            const messageSended = messageSendedList[index] ? messageSendedList[index][1] : null;
            if (messageSended) {
                if (elementToSend !== messageSended.content) await Message.edit(messageSended, elementToSend)
            } else {
                Channel.send(channel, elementToSend);
            }
        }
    });
}

module.exports.run = (client, message, channelData, userData) => {
    const channel = message.channel;
    client.textChannel[textChannelType].get("reload").reload(client, channel);
}

module.exports.help = {
    name: "reload"
};