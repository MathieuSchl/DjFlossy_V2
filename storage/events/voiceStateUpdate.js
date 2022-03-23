function detectTheAction(oldState, newState) {
    if (!oldState.channel && newState.channel) return "join";
    if (oldState.channel && !newState.channel) return "disconnect";
    if (oldState.channel && newState.channel && (oldState.channel.id !== newState.channel.id)) return "move";
    if ((oldState.serverDeaf) === false && (newState.serverDeaf) === true) return "serverDeaf";
    if ((oldState.serverMute) === false && (newState.serverMute) === true) return "serverMute";
    if ((oldState.serverDeaf) === true && (newState.serverDeaf) === false) return "serverUnDeaf";
    if ((oldState.serverMute) === true && (newState.serverMute) === false) return "serverUnMute";
    if ((oldState.selfDeaf) === false && (newState.selfDeaf) === true) return "selfDeaf";
    if ((oldState.selfMute) === false && (newState.selfMute) === true) return "selfMute";
    if ((oldState.selfDeaf) === true && (newState.selfDeaf) === false) return "selfUnDeaf";
    if ((oldState.selfMute) === true && (newState.selfMute) === false) return "selfUnMute";
    if ((oldState.selfVideo) === false && (newState.selfVideo) === true) return "startVideo";
    if ((oldState.selfVideo) === true && (newState.selfVideo) === false) return "endVideo";
    if ((oldState.streaming) === false && (newState.streaming) === true) return "startStreaming";
    if ((oldState.streaming) === true && (newState.streaming) === false) return "endStreaming";
    return false;
}

module.exports.run = async (client, oldState, newState) => {
    const theAction = detectTheAction(oldState, newState);
    if (!theAction) return;
    if ((theAction === "join" || theAction === "move") && (newState.channel.members.get(client.user.id))) {
        if (newState.channel.members.size === 2 || ((newState.member.user.id === client.user.id) && newState.channel.members.size >= 2)) {
            let queue = client.player.createQueue(newState.guild.id);
            await queue.join(newState.channel);
            client.dataBase.get("guild").select(client, newState.guild.id, async (error, results) => {
                if (error) throw error;
                const playlistSelected = results[0].v_data.playlistSelected ? results[0].v_data.playlistSelected : null;
                client.basicFunctions.get("startMusic").run(client, queue, playlistSelected);
            });
        }
    } else if ((theAction === "disconnect" || theAction === "move") && (oldState.channel.members.get(client.user.id))) {
        if (oldState.channel.members.size < 2) {
            let queue = client.player.createQueue(oldState.guild.id);
            queue.stop();
            client.dataBase.get("guild").select(client, oldState.guild.id, async (error, result) => {
                if (error) throw error;
                if (!result[0] || !result[0].v_data.musicVoiceChannel || result[0].v_data.musicVoiceChannel === oldState.channel.id) return;
                const voiceChannel = await client.channels.fetch(result[0].v_data.musicVoiceChannel);
                await client.basicFunctions.get("wait").run(300);
                await queue.connection.leave();
                await client.basicFunctions.get("wait").run(300);
                queue = client.player.createQueue(oldState.guild.id);
                await queue.join(voiceChannel);
            })
        }
    }

}


module.exports.help = {
    name: "voiceStateUpdate"
};