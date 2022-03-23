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
        callback(results[0]);
    });
}

function getMessage(client, message, callback) {
    client.dataBase.get("message").select(client, message.id, (error, results, fields) => {
        if (error) throw error;

        callback(results[0])
    });
}


module.exports.run = async (client, messageReaction, user) => {
    if (user.id === client.user.id) return;
    if (messageReaction.message.author.id !== client.user.id) return;
    const usersOnTheMessage = await messageReaction.users.fetch(client.user.id);
    if (usersOnTheMessage.get(client.user.id) == null) return;

    getUser(client, user, messageReaction.message.guild, (userData) => {
        getMessage(client, messageReaction.message, (messageData) => {
            if (messageData == null) return;
            const indexOfAction = messageData.v_emoji.indexOf(messageReaction.emoji.name)
            const action = messageData.v_type[indexOfAction];
            try {
                client.message[action].get("index").removeReaction(client, messageReaction, messageData, user, userData);
            } catch (e) {
                console.log("message with action '" + action + "' doesn't exist");
            }
        })
    })
}

module.exports.help = {
    name: "messageReactionRemove"
};