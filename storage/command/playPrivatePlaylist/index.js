const Interaction = require("../../discordToolsBox/interaction");
const getLanguageDataFunc = require("../../basicFunctions/getLanguageData");


function getLanguageData(language, tag) {
    return getLanguageDataFunc.get({
        language: language,
        category: "command",
        type: "playPrivatePlaylist",
        tag: tag
    })
}

module.exports.run = async (client, interaction, user, userData, guild, guildData) => {
    const guildLanguage = guildData.v_language;
    const replyLanguage = guildLanguage ? guildLanguage : client.config.defaultUserLanguage ? client.config.defaultUserLanguage : "en";

    client.dataBase.get("connection").exec(client.db, "SELECT v_name AS 'name', v_tag AS 'tag' FROM `playlist` WHERE i_user = ?;", [user.id], (error, results, fields) => {
        if (error) throw error;

        const messageData = client.command.playPrivatePlaylist.get("getMessage").languageMessage.message(replyLanguage, results);
        messageData.components = client.command.playPrivatePlaylist.get("getMessage").languageMessage.actionRow(replyLanguage, results);
        messageData.ephemeral = true;

        Interaction.reply(interaction, messageData);
    });
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
    return [];
}