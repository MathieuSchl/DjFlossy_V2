module.exports.deleteChannel = async (channel, callback) => {
    if(!channel){
        if (callback) callback();
        return true;
    }
    return await new Promise((resolve) => {
        channel.delete().then(() => {
            if (callback) callback();
            resolve(true);
        }).catch((err) => {
            if (callback) callback(err);
            console.log(err);
            resolve(false);
        });
    })
}

module.exports.messagesFetch = async (channel, data) => {
    return await new Promise((resolve) => {
        channel.messages.fetch(data).then((messages) => {
            resolve(messages);
        }).catch((err) => {
            if (err.code === 10008) resolve(null);
            else {
                console.log(err);
                resolve(false);
            }
        });
    })
}

module.exports.send = async (channel, data, callback) => {
    return await new Promise((resolve) => {
        channel.send(data).then((msg) => {
            if (callback) callback(msg);
            resolve(msg)
        }).catch((err) => {
            if (callback) callback(err);
            console.log(err);
            resolve(false);
        });
    })
}

module.exports.edit = async (channel, data, callback) => {
    return await new Promise((resolve) => {
        channel.edit(data).then((channel) => {
            if (callback) callback(channel);
            resolve(channel)
        }).catch((err) => {
            if (callback) callback(err);
            console.log(err);
            resolve(false);
        });
    })
}

module.exports.deleteAll = async (client, channel) => {
    await channel.messages.fetch();
    const messagesBeforeBulkDelete = Array.from(channel.messages.cache);
    if (await client.discordToolsBox.get("channel").bulkDelete(channel, messagesBeforeBulkDelete.length)) return false;
    await channel.messages.fetch();
    const messages = Array.from(channel.messages.cache);
    for (let index = 0; index < messages.length; index++) {
        const element = messages[index][1];
        if (await client.discordToolsBox.get("message").delete(element)) return false;
    }
    return true;
}

module.exports.bulkDelete = async (channel, intDelete, callback) => {
    return await new Promise((resolve) => {
        channel.bulkDelete(intDelete).then(() => {
            if (callback) callback();
            resolve(true)
        }).catch((err) => {
            if (callback) callback(err);
            console.log(err);
            resolve(false);
        })
    })
}





module.exports.help = {
    name: "channel"
};