const Guild = require('../../discordToolsBox/guild');
const getLanguageDataFunc = require("../../basicFunctions/getLanguageData");
const config = require("../../../config.json");

function getLanguageData(language, tag) {
    return getLanguageDataFunc.get({
        language: language,
        category: "guildCreateAction",
        type: "createChannelForFlossy",
        tag: tag
    })
}

module.exports.run = async (client, guild) => {
    client.dataBase.get("guild").select(client, guild.id, async (error, result, fields) => {
        if (error) throw error;
        const lg = result[0].v_language ? result[0].v_language : config.defaultGuildLanguage ? config.defaultGuildLanguage : "en";

        const category = await Guild.createChannel(guild, getLanguageData(lg, "CATEGORY_NAME"), {
            "type": "GUILD_CATEGORY"
        });
        const textChannel = await Guild.createChannel(guild, getLanguageData(lg, "TEXT_CHANNEL_NAME"), {
            "type": "GUILD_TEXT",
            "parent": category.id
        });
        const voiceChannel = await Guild.createChannel(guild, getLanguageData(lg, "VOICE_CHANNEL_NAME"), {
            "type": "GUILD_VOICE",
            "parent": category.id
        });

        client.dataBase.get("category").insert(client, {
            "v_id": category.id,
            "v_idGuild": category.guild.id,
            "v_type": "music",
            "t_deleteifempty": true
        }, async (error) => {
            if (error) throw error;

            client.dataBase.get("textChannel").insert(client, {
                "v_id": textChannel.id,
                "v_idGuild": textChannel.guild.id,
                "v_type": "musicPannel",
                "v_language": lg
            }, async (error) => {
                if (error) throw error;

                client.dataBase.get("guild").updateOneRow(client, {
                    "v_id": category.guild.id,
                    "v_data": JSON.stringify({
                        "musicCategory": category.id,
                        "musicPannel": textChannel.id,
                        "musicVoiceChannel": voiceChannel.id
                    })
                }, async (error) => {
                    if (error) throw error;

                    client.textChannel["musicPannel"].get("reload").reload(client, textChannel, lg);
                    await client.basicFunctions.get("wait").run(5000);
                    client.dataBase.get("guild").select(client, textChannel.guild.id, async (error, results) => {
                        if (error) throw error;
                        await client.basicFunctions.get("startGuildPlayer").oneGuild(client, results[0]);
                    })
                });
            })
        });
    });
}

module.exports.help = {
    name: "index"
};