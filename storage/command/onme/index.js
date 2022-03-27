const Interaction = require("../../discordToolsBox/interaction");
const Guild = require("../../discordToolsBox/guild");
const getLanguageDataFunc = require("../../basicFunctions/getLanguageData");


function getLanguageData(language, tag) {
    return getLanguageDataFunc.get({
        language: language,
        category: "command",
        type: "onme",
        tag: tag
    })
}

module.exports.changeChannel = changeChannel
async function changeChannel(client, guild, VCTarget) {
    if (guild.me.voice.channel) {
        let guildQueue = client.player.getQueue(guild.id);
        if (!guildQueue) {
            guildQueue = client.player.createQueue(guild.id);
            await guildQueue.join(guild.me.voice.channel);
            await client.basicFunctions.get("wait").run(300);
            await guildQueue.connection.leave();
            await client.basicFunctions.get("wait").run(1000);
        } else {
            if (guildQueue && guildQueue.stop) guildQueue.stop();
            guildQueue.connection.leave();
            await client.basicFunctions.get("wait").run(1000);
        }
    }

    let queue = client.player.getQueue(guild.id) == null ? client.player.createQueue(guild.id) : client.player.getQueue(guild.id);

    await queue.join(VCTarget).catch((err) => {
        console.log("Queue join onme");
        console.log(err);
    });
}


module.exports.run = async (client, interaction, user, userData, guild, guildData) => {
    const guildLanguage = guildData.v_language;
    const memberLanguage = userData.v_language;
    const replyLanguage = guildLanguage ? guildLanguage : client.config.defaultUserLanguage ? client.config.defaultUserLanguage : "en";

    const member = await Guild.fetchMembers(interaction.guild, user.id);
    if (!member.voice.channelId) {
        Interaction.reply(interaction, {
            content: getLanguageData(replyLanguage, "USER_NOT_IN_VOICE_CHANNEL"),
            ephemeral: true
        });
        return;
    }
    Interaction.reply(interaction, {
        content: getLanguageData(replyLanguage, "BOT_CHANGED_CHANNEL").replace('<§botTag§>', '<@' + client.user + '>'),
        ephemeral: true
    });

    const voiceChannel = member.voice.channel;
    changeChannel(client, guild, voiceChannel);
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