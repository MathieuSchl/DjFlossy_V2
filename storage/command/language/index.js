const Interaction = require("../../discordToolsBox/interaction");
const Guild = require("../../discordToolsBox/guild");
const Channel = require("../../discordToolsBox/channel");
const Message = require("../../discordToolsBox/message");
const getLanguageDataFunc = require("../../basicFunctions/getLanguageData");


function getLanguageData(language, tag) {
    return getLanguageDataFunc.get({
        language: language,
        category: "command",
        type: "language",
        tag: tag
    })
}

function getLanguageDataGlobalFlags(language, tag) {
    return getLanguageDataFunc.get({
        language: language,
        category: "globalFlags",
        type: null,
        tag: tag
    })
}



module.exports.run = async (client, interaction, user, userData, guild, guildData) => {
    const guildLanguage = guildData.v_language;
    const memberLanguage = userData.v_language;
    const replyLanguage = memberLanguage ? memberLanguage : guildLanguage ? guildLanguage : client.config.defaultUserLanguage ? client.config.defaultUserLanguage : "en";

    if (guild.ownerId !== user.id) {
        Interaction.reply(interaction, {
            content: getLanguageData(replyLanguage, "ONLY_GUILD_OWNER"),
            ephemeral: true
        });
        return;
    }

    const nbLangChannels = await new Promise((resolve) => {

        client.dataBase.get("textChannel").selectATypeOfChannelInGuild(client, guild.id, "changeLang", async (error, results) => {
            if (error) console.log(error);
            resolve(results.length);
        })
    });

    if (nbLangChannels !== 0) {
        Interaction.reply(interaction, {
            content: getLanguageData(replyLanguage, "CHANNEL_LANGUAGE_ALREADY_CREATED"),
            ephemeral: true
        });
        return;
    }

    Interaction.reply(interaction, {
        content: getLanguageData(replyLanguage, "CHANNEL_LANGUAGE_CREATED"),
        ephemeral: true
    });

    const messageData = client.command.language.get("getMessage").languageMessage.message(guildLanguage);
    messageData.components = client.command.language.get("getMessage").languageMessage.actionRow(guildLanguage);
    const category = await (client.basicFunctions.get("getCategoryAdmin").run(guild));
    if (!category) return;
    Guild.createChannel(guild, "CHANN_CHANGE_LANGUAGE", {
        "parent": category
    }).then((langChannel) => {
        client.dataBase.get("textChannel").insert(client, {
            "v_id": langChannel.id,
            "v_idGuild": guild.id,
            "v_type": "changeLang",
            "v_language": guildLanguage
        }, async (error) => {
            if (error) console.log(error);

            const pingMess = await Channel.send(langChannel, "<@" + user.id + ">");
            await Message.delete(pingMess);

            Channel.send(langChannel, messageData, (msg) => {
                let count = 0;
                const intervalObj = setInterval(async function () {
                    if ((!msg.deleted) && (count >= 24)) {
                        if (!msg.deleted) Message.delete(msg, async () => {
                            if (msg.channel) await Channel.deleteChannel(msg.channel);
                        });
                        clearInterval(intervalObj);
                    } else {
                        const messageEditData = client.command.language.get("getMessage").languageMessage.message(guildLanguage);
                        const res = await Message.edit(msg, messageEditData);
                        if (!res) clearInterval(intervalObj)
                        count++;
                    }

                }, 5000);

                client.intervalList.push(intervalObj);

                client.dataBase.get("message").insert(client, {
                    "v_id": msg.id,
                    "v_idChannel": msg.channel.id,
                    "v_idGuild": guild.id,
                    "v_language": guildLanguage,
                    "v_category_mess": "command",
                    "v_type_mess": "language",
                    "v_name_mess": "languageMessage",
                    "v_emoji": [],
                    "v_type": [],
                    "v_data": {}
                }, (error) => {
                    if (error) console.log(error);
                })
            });
        })
    })
}



module.exports.help = {
    name: "index"
}

module.exports.getCommandData = (client, data) => {
    let language = data.language;
    language = language ? language : client.config.defaultGuildLanguage ? client.config.defaultGuildLanguage : "en";
    return {
        name: getLanguageData(language, "NAME"),
        description: getLanguageData(language, "DESCRIPTION")
    }
}

module.exports.getPermissions = (client, data) => {
    if (data.clientCommand) return false;
    let guild = data.guild;
    if (!guild) return null;
    return [{
        id: guild.ownerId,
        type: 'USER',
        permission: true,
    }, {
        id: guild.roles.everyone.id,
        type: 'ROLE',
        permission: false,
    }]
}