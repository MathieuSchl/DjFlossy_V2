const Client = require("../discordToolsBox/client");
const Guild = require("../discordToolsBox/guild");


module.exports.oneGuild = oneGuild;
async function oneGuild(client, data) {
    const voiceChannel = await Client.channelFetch(client, data.v_data.musicVoiceChannel);
    if (!voiceChannel) return;
    const guild = await Client.guildsFetch(client, data.v_id);
    if (!guild) return;
    client.command.onme.get("index").changeChannel(client, guild, voiceChannel);
};


module.exports.allGuilds = async (client) => {
    client.dataBase.get("guild").selectAll(client, async (error, result) => {
        if (error) throw error;
        for (let index = 0; index < result.length; index++) {
            const element = result[index];
            if (element.v_data.musicVoiceChannel) await oneGuild(client, element);
        }
    });
};

module.exports.help = {
    name: "startGuildPlayer"
};