const Client = require("../discordToolsBox/client");
const Channel = require("../discordToolsBox/channel");
const Message = require("../discordToolsBox/message");


module.exports.run = async (client) => {

    //Delete specific messages
    const messagesToDelete = ["languageMessage"];
    await new Promise((resolve) => {
        client.dataBase.get("message").selectListOfElements(client, messagesToDelete, async (error, results, fields) => {
            if (error) {
                throw error;
            }
            for (let index = 0; index < results.length; index++) {
                const element = results[index];
                const channel = await Client.channelFetch(client, element.v_idChannel);
                if (channel) {
                    const message = await Channel.messagesFetch(channel, element.v_id);
                    if (message) await Message.delete(message);
                }
            }

            client.dataBase.get("message").deleteListOfElements(client, messagesToDelete, async (error, results, fields) => {
                if (error) throw error;
                resolve()
            })
        });
    })

    //Delete specific channels
    const channelsToDelete = ["changeLang"];
    await new Promise((resolve) => {
        client.dataBase.get("textChannel").selectListOfElements(client, channelsToDelete, async (error, results, fields) => {
            if (error) {
                throw error;
            }
            for (let index = 0; index < results.length; index++) {
                const element = results[index];
                const channel = await Client.channelFetch(client, element.v_id);
                if (channel) await Channel.deleteChannel(channel);
            }

            client.dataBase.get("textChannel").deleteListOfElements(client, channelsToDelete, async (error, results, fields) => {
                if (error) throw error;
                resolve()
            })
        });
    })
}


module.exports.help = {
    name: "deleteSomeTypeOfElement"
};