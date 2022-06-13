const Interaction = require("../../discordToolsBox/interaction");
const Guild = require("../../discordToolsBox/guild");
const getLanguageDataFunc = require("../../basicFunctions/getLanguageData");


function getLanguageData(language, tag) {
    return getLanguageDataFunc.get({
        language: language,
        category: "command",
        type: "addPlaylist",
        tag: tag
    })
}

async function insertPlaylist(client, interaction, user, replyLanguage, playlistTocken) {
    const name = await client.basicFunctions.get("getVideosFromYtPlaylist").getName(playlistTocken);
    if (!name) {
        Interaction.editReply(interaction, {
            content: getLanguageData(replyLanguage, "INVALID_URL").replace('<§url§>', '`' + interaction.options.get("url").value + '`'),
            ephemeral: true
        });
        return;
    }

    client.dataBase.get("connection").exec(client.db, "SELECT 1 FROM `playlist` WHERE i_user = ? AND v_tag = ?;", [user.id, playlistTocken], (error, results, fields) => {
        if (error) throw error;

        if (results.length > 0) {
            Interaction.editReply(interaction, {
                content: getLanguageData(replyLanguage, "PLAYLIST_ALREADY_EXIST").replace('<§url§>', '`' + interaction.options.get("url").value + '`'),
                ephemeral: true
            });
            return
        }

        client.dataBase.get("connection").exec(client.db, "INSERT INTO `playlist` (`i_user`, `v_name`, `v_tag`) VALUES (?, ?, ?)", [user.id, name, playlistTocken], (error, results, fields) => {
            if (error) throw error;

            Interaction.editReply(interaction, {
                content: getLanguageData(replyLanguage, "PLAYLIST_ADDED").replace('<§url§>', '`' + interaction.options.get("url").value + '`'),
                ephemeral: true
            });
        })
    });
}

module.exports.run = async (client, interaction, user, userData, guild, guildData) => {
    const guildLanguage = guildData.v_language;
    const replyLanguage = guildLanguage ? guildLanguage : client.config.defaultUserLanguage ? client.config.defaultUserLanguage : "en";
    const url = interaction.options.get("url").value;
    await Interaction.deferReply(interaction, {
        ephemeral: true
    })

    if (url.startsWith('https://www.youtube.com/playlist?list=') || url.startsWith('https://youtube.com/playlist?list=')) {
        const playlistTocken = url.split("playlist?list=")[1];
        insertPlaylist(client, interaction, user, replyLanguage, playlistTocken);
    } else {
        insertPlaylist(client, interaction, user, replyLanguage, url);
    }
}


module.exports.help = {
    name: "index"
}

module.exports.getCommandData = (client, data) => {
    let language = data.language;
    language = language ? language : client.config.defaultGuildLanguage ? client.config.defaultGuildLanguage : "en";
    return {
        name: getLanguageData(language, "NAME"),
        description: getLanguageData(language, "DESCRIPTION"),
        options: [{
            type: "STRING",
            name: "url",
            description: getLanguageData(language, "DESCRIPTION_OPTION_URL"),
            required: true
        }]
    }
}

module.exports.getPermissions = (client, data) => {
    if (data.clientCommand) return false;
    return [];
}