const Client = require("../../discordToolsBox/client");
const Channel = require("../../discordToolsBox/channel");
const Message = require("../../discordToolsBox/message");
const Interaction = require("../../discordToolsBox/interaction");


module.exports.run = async (client, interaction) => {
    const newLang = interaction.values[0];

    //change db data
    const idGuild = await new Promise((resolve) => {
        client.dataBase.get("message").select(client, interaction.message.id, (error, results) => {
            if (error) console.log(error);

            const idGuild = results[0].v_idGuild
            client.dataBase.get("guild").updateOneRow(client, {
                "v_id": idGuild,
                "v_language": newLang
            }, (error) => {
                if (error) console.log(error);

                client.dataBase.get("textChannel").updateFromGuild(client, {
                    "v_idGuild": idGuild,
                    "v_language": newLang
                }, (error, results) => {
                    if (error) console.log(error);

                    client.dataBase.get("message").updateFromGuild(client, {
                        "v_idGuild": idGuild,
                        "v_language": newLang
                    }, (error, results) => {
                        if (error) console.log(error);
                        resolve(idGuild);
                    })
                })
            })
        })
    })

    //reply to command
    const guild = await Client.guildsFetch(client, idGuild);
    const messData = client.selectMenu.selectLang.get("getMessage").languageReply.message(newLang, {
        guildName: guild.name
    });

    await Message.delete(interaction.message);
    await Interaction.reply(interaction, messData);

    const timeoutObj = setTimeout(async () => {
        await Interaction.deleteReply(interaction);
        await Channel.deleteChannel(interaction.channel);
    }, 30000);
    client.timeoutList.push(timeoutObj);

    //reload all messages for a guild
    client.dataBase.get("message").selectAllFromAGuild(client, idGuild, async (error, results) => {
        if (error) console.log(error);

        for (let index = 0; index < results.length; index++) {
            try {
                const element = results[index];
                const channel = await Client.channelFetch(client, element.v_idChannel);
                if (channel) {
                    const message = await Channel.messagesFetch(channel, element.v_id);
                    if (message) {
                        const getMessage = client[element.v_category_mess][element.v_type_mess].get("getMessage")[element.v_name_mess];
                        const messageData = getMessage.message(newLang);
                        if (getMessage.actionRow) messageData.components = await getMessage.actionRow(newLang, {
                            client: client
                        });

                        await Message.edit(message, messageData);
                    }
                }
            } catch (error) {
                console.log("Error for reload messages");
                console.log(error.message);
            }
        }
        const guild = await Client.guildsFetch(client, idGuild);
        client.basicFunctions.get("loadCommands").testCommands(guild);
    });
    return;
}


module.exports.help = {
    name: "index",
    ephemeral: false
};