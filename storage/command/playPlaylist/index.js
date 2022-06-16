const Interaction = require("../../discordToolsBox/interaction");
const Guild = require("../../discordToolsBox/guild");
const getLanguageDataFunc = require("../../basicFunctions/getLanguageData");
const {
    RepeatMode
} = require('discord-music-player');


function getLanguageData(language, tag) {
    return getLanguageDataFunc.get({
        language: language,
        category: "command",
        type: "playPlaylist",
        tag: tag
    })
}

module.exports.run = async (client, interaction, user, userData, guild, guildData) => {
    const guildLanguage = guildData.v_language;
    const replyLanguage = guildLanguage ? guildLanguage : client.config.defaultUserLanguage ? client.config.defaultUserLanguage : "en";
    const member = await Guild.fetchMembers(interaction.guild, user.id);
    if (!member.voice.channelId) {
        Interaction.reply(interaction, {
            content: getLanguageData(replyLanguage, "USER_NOT_IN_VOICE_CHANNEL"),
            ephemeral: true
        });
        return;
    }
    await Interaction.deferReply(interaction, {
        ephemeral: true
    })
    const commandLanguage = guildData.v_language ? guildData.v_language : "en";
    const idPlaylist = interaction.options.get(getLanguageData(commandLanguage, "OPTION_NAME_PLAYLIST")).value;
    client.dataBase.get("connection").exec(client.db, 'SELECT ml.v_tagName FROM `musicscorrelation` INNER JOIN musicslist AS ml ON ml.i_id = i_idMusic WHERE i_idTag = ?;', [idPlaylist], async (error, results, fields) => {
        const musicsTags = [];
        for (const result of results) {
            musicsTags.push(result.v_tagName);
        }
        client.command.play.get("index").startSong(client, interaction, musicsTags, RepeatMode.QUEUE, client.user, replyLanguage);
    })
}

module.exports.help = {
    name: "index"
}

module.exports.getCommandData = async (client, data) => {
    let language = data.language;
    language = language ? language : client.config.defaultGuildLanguage ? client.config.defaultGuildLanguage : "en";
    const playlists = await new Promise((resolve, reject) => {
        client.dataBase.get("playlist").selectAllEnable(client, async (error, playlistData) => {
            if (error) throw error;

            resolve(playlistData)
        });
    })

    const choices = [];
    for (const playlist of playlists) {
        choices.push({
            name: playlist.v_name,
            value: playlist.i_id + ""
        })
    }

    return {
        name: getLanguageData(language, "NAME"),
        description: getLanguageData(language, "DESCRIPTION"),
        options: [{
            type: "STRING",
            autocomplete: true,
            required: true,
            name: getLanguageData(language, "OPTION_NAME_PLAYLIST"),
            description: getLanguageData(language, "OPTION_DESCRIPTION_PLAYLIST"),
            choices
        }]
    }
}

module.exports.getPermissions = (client, data) => {
    if (data.clientCommand) return false;
    return [];
}