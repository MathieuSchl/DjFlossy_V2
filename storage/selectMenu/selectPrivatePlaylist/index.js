const Client = require("../../discordToolsBox/client");
const Channel = require("../../discordToolsBox/channel");
const Message = require("../../discordToolsBox/message");
const Interaction = require("../../discordToolsBox/interaction");
const {
    RepeatMode
} = require('discord-music-player');


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