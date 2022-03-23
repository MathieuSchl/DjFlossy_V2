const Interaction = require("../../discordToolsBox/interaction");
const Guild = require("../../discordToolsBox/guild");
const getLanguageDataFunc = require("../../basicFunctions/getLanguageData");


function getLanguageData(language, tag) {
    return getLanguageDataFunc.get({
        language: language,
        category: "command",
        type: "next",
        tag: tag
    })
}


module.exports.run = async (client, interaction, user, userData, guild, guildData) => {
    const guildLanguage = guildData.v_language;
    const memberLanguage = userData.v_language;
    const replyLanguage = memberLanguage ? memberLanguage : guildLanguage ? guildLanguage : client.config.defaultUserLanguage ? client.config.defaultUserLanguage : "en";

    if (!interaction.guild.me.voice.channelId) {
        Interaction.reply(interaction, {
            content: getLanguageData(replyLanguage, "BOT_NOT_IN_VOICE_CHANNEL").replace('<§botTag§>', '<@' + client.user + '>'),
            ephemeral: true
        });
        return;
    }

    const member = await Guild.fetchMembers(interaction.guild, user.id);
    if (!member.voice.channelId || member.voice.channelId !== interaction.guild.me.voice.channelId) {
        Interaction.reply(interaction, {
            content: getLanguageData(replyLanguage, "USER_NOT_IN_VOICE_CHANNEL").replace('<§botTag§>', '<@' + client.user + '>'),
            ephemeral: true
        });
        return;
    }

    let guildQueue = client.player.getQueue(interaction.guild.id);
    guildQueue.skip();

    Interaction.reply(interaction, {
        content: getLanguageData(replyLanguage, "SKIP_MUSIC"),
        ephemeral: true
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