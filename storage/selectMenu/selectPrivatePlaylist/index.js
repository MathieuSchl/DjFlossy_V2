const Guild = require("../../discordToolsBox/guild");
const Interaction = require("../../discordToolsBox/interaction");
const getLanguageDataFunc = require("../../basicFunctions/getLanguageData");
const {
    RepeatMode
} = require('discord-music-player');


function getLanguageData(language, tag) {
    return getLanguageDataFunc.get({
        language: language,
        category: "command",
        type: "playPrivatePlaylist",
        tag: tag
    })
}


module.exports.run = async (client, interaction) => {
    const playlistTocken = interaction.values[0];

    const guild = interaction.channel.guild;
    const guildData = await new Promise((resolve) => {
        client.dataBase.get("guild").select(client, guild.id, (error, results, fields) => {
            if (error) throw error;

            resolve(results[0])
        });
    })

    const guildLanguage = guildData.v_language;
    const replyLanguage = guildLanguage ? guildLanguage : client.config.defaultUserLanguage ? client.config.defaultUserLanguage : "en";
    const member = await Guild.fetchMembers(interaction.guild, interaction.user.id);
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

    let queue = client.player.getQueue(interaction.guild.id) == null ? client.player.createQueue(interaction.guild.id) : client.player.getQueue(interaction.guild.id);
    if (queue.isPlaying) {
        await queue.clearQueue();
        await queue.skip()
    }
    client.command.play.get("index").startPlaylist(client, interaction, playlistTocken, true, RepeatMode.QUEUE, interaction.user, replyLanguage);
}


module.exports.help = {
    name: "index",
    ephemeral: false
};