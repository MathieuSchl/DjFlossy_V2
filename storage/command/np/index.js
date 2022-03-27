const Interaction = require("../../discordToolsBox/interaction");
const Guild = require("../../discordToolsBox/guild");
const getLanguageDataFunc = require("../../basicFunctions/getLanguageData");


function getLanguageData(language, tag) {
    return getLanguageDataFunc.get({
        language: language,
        category: "command",
        type: "np",
        tag: tag
    })
}

function replaceAll(str, find, replace) {
    return str.replace(new RegExp(escapeRegExp(find), 'g'), replace);
}


module.exports.run = async (client, interaction, user, userData, guild, guildData) => {
    const guildLanguage = guildData.v_language;
    const memberLanguage = userData.v_language;
    const replyLanguage = guildLanguage ? guildLanguage : client.config.defaultUserLanguage ? client.config.defaultUserLanguage : "en";

    if (!guild.me.voice.channelId) {
        Interaction.reply(interaction, {
            content: getLanguageData(replyLanguage, "BOT_NOT_CONNECTED").replace('<§botTag§>', '<@' + client.user + '>'),
            ephemeral: true
        });
        return;
    }
    let guildQueue = client.player.getQueue(guild.id);
    if (!guildQueue || guildQueue.songs.length == 0) {
        Interaction.reply(interaction, {
            content: getLanguageData(replyLanguage, "NO_MUSIC_PLAYED").replace('<§botTag§>', '<@' + client.user + '>'),
            ephemeral: true
        });
        return;
    }

    const progress = guildQueue.createProgressBar()
    const song = guildQueue.songs[0];

    let footer = {}
    if (song.requestedBy) {
        footer.text = song.requestedBy.tag;
        footer.iconURL = song.requestedBy.displayAvatarURL();
    }

    Interaction.reply(interaction, {
        embeds: [{
            "title": song.name,
            "description": song.author + "\n\n" +
                "|" + progress.bar.replaceAll(' ', '=') + "|\n" +
                progress.times,
            "url": song.url,
            "color": 0x939393,
            "thumbnail": {
                "url": song.thumbnail
            },
            "footer": footer,
            "timestamp": new Date()
        }],
        ephemeral: true
    });
    return;
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