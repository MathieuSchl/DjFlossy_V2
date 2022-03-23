const getLanguageDataFunc = require("../../basicFunctions/getLanguageData");
const Interaction = require("../../discordToolsBox/interaction");
const { RepeatMode } = require('discord-music-player');
const ephemeral = true;


function getLanguageData(language, tag) {
    return getLanguageDataFunc.get({
        language: language,
        category: "selectMenu",
        type: "musicPannel",
        tag: tag
    })
}

module.exports.run = async (client, interaction) => {
    const lg = "fr";
    const value = parseInt(interaction.values[0]);
    client.dataBase.get("playlist").selectById(client, value, async (error, results) => {
        if (error) throw error;
        const result = results[0];
        await Interaction.reply(interaction, {
            "content": getLanguageData(lg, "CHANGE_PLAYLIST_MESSAGE_1") + result.v_data[lg].label + getLanguageData(lg, "CHANGE_PLAYLIST_MESSAGE_2"),
            "ephemeral": ephemeral
        })
        client.dataBase.get("guild").select(client, interaction.guild.id, (error, results, fields) => {
            if (error) throw error;
            if (results[0] && results[0].v_data) results[0].v_data.playlistSelected = value;

            client.dataBase.get("guild").updateOneRow(client, results[0], async (error, results, fields) => {
                if (error) throw error;

                if (interaction.guild && interaction.guild.me.voice.channel) {
                    if (interaction.guild.me.voice.channel.members.size > 1) {
                        let queue = client.player.createQueue(interaction.guild.id);
                        await queue.setRepeatMode(RepeatMode.DISABLED);
                        await queue.clearQueue();
                        await queue.skip(1);
                        client.basicFunctions.get("startMusic").run(client, queue, value);
                    }
                }
            });
        });
    });
}


module.exports.help = {
    name: "index",
    ephemeral: ephemeral
};