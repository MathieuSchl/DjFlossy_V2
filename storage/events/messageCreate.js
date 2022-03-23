const messageTypeToBan = ["GUILD_MEMBER_JOIN", "USER_PREMIUM_GUILD_SUBSCRIPTION_TIER_1", "USER_PREMIUM_GUILD_SUBSCRIPTION_TIER_2", "USER_PREMIUM_GUILD_SUBSCRIPTION_TIER_3"]


function getUser(client, user, guild, callback) {
    client.dataBase.get("guildMembers").select(client, user.id, guild.id, (error, results, fields) => {
        if (error) throw error;

        if (results.length === 0) {
            client.dataBase.get("guildMembers").insert(client, {
                "v_idUser": user.id,
                "v_idGuild": guild.id,
                "t_allowedSpecialChannel": !user.bot
            }, (error, results, fields) => {
                if (error) throw error;
                return getUser(client, user, guild, callback);
            })
        }
        callback(results[0])
    });
}

function getChannel(client, channel, callback) {
    client.dataBase.get("textChannel").select(client, channel.id, (error, results, fields) => {
        if (error) throw error;

        callback(results[0])
    });
}

module.exports.run = (client, message) => {
    if (messageTypeToBan.includes(message.type)) return;
    const user = message.author;
    if (!user.id || user.id === client.user.id) return;

    getUser(client, user, message.guild, (userData) => {
        getChannel(client, message.channel, async (channelData) => {
            if (channelData == null) {
                if (userData.t_muted === 1) await client.discordToolsBox.get("message").delete(message);
            } else {
                if (userData.t_allowedSpecialChannel === 0) await client.discordToolsBox.get("message").delete(message);
                else {
                    if (channelData.v_language == null) {

                    } else {
                        try {
                            client.textChannel[channelData.v_type].get("index").run(client, message, channelData, userData);
                        } catch (e) {
                            console.log("textChanel '" + channelData.v_type + "' doesn't exist");
                        }
                    }
                }
            }
        })
    })
}

module.exports.help = {
    name: "messageCreate"
};