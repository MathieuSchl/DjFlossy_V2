module.exports.delete = async (message, callback) => {
    await new Promise((resolve) => {
        const client = message.client;
        client.dataBase.get("message").delete(client, message.id, (error) => {
            if (error) console.log(error);

            if (message.deletable && !message.deleted) {
                message.delete().then(() => {
                    if (callback) callback(true);
                    resolve(true);
                }).catch((err) => {
                    console.log(err);
                    if (callback) callback(false);
                    resolve(false);
                });
            } else {
                if (callback) callback(false);
                resolve(false);
            }
        })
    })
    return;
}

module.exports.react = async (message, emoji, callback) => {
    return await new Promise((resolve) => {
        message.react(emoji).then((reaction) => {
            if (callback) callback(reaction);
            resolve(reaction)
        }).catch((err) => {
            console.log(err);
            if (callback) callback(false);
            resolve(false);
        });
    })
}

module.exports.pin = async (message, callback) => {
    return await new Promise((resolve) => {
        message.pin().then((msg) => {
            if (callback) callback(msg);
            resolve(msg)
        }).catch((err) => {
            console.log(err);
            if (callback) callback(false);
            resolve(false);
        });
    })
}

module.exports.edit = async (message, data, callback) => {
    if (!message) return console.log("'message' in 'Message.edit' is null");
    if (message.constructor.name !== "Message") return console.log("'message' in 'Message.edit' is not an 'Message' object");
    if (!data) return console.log("'data' in 'Message.edit' is null");
    if (data.constructor.name !== "Object" && data.constructor.name !== "String") return console.log("'data' in 'Message.edit' is not an 'Object' or a 'String' object");
    if (callback && callback.constructor.name !== "Function") return console.log("'callback' in 'Message.edit' is not an 'Function' object");

    if (!message.channel) return null;
    if (!message.channel.guild) return null;
    return await new Promise((resolve) => {
        message.edit(data).then(() => {
            if (callback) callback(message);
            resolve(message);
        }).catch((err) => {
            if (![10008].includes(err.code)) console.log(err);
            if (callback) callback(false);
            resolve(false);
        });
    })
}


module.exports.help = {
    name: "message"
};