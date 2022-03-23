module.exports.create = async (client, data, callback) => {
    return await new Promise((resolve) => {
        client.application.commands.create(data).then((command) => {
            if (callback) callback(command);
            resolve(command);
            resolve(true);
        }).catch((err) => {
            if (callback) callback(err);
            console.log(err);
            resolve(false);
        });
    })
}

module.exports.fetch = async (client, data, callback) => {
    return await new Promise((resolve) => {
        client.application.commands.fetch(data)
            .then((command) => {
                resolve(command);
                if (callback) callback(command);
                resolve(true);
            }).catch((err) => {
                if (callback) callback(err);
                console.log(err);
                resolve(false);
            });
    })
}

module.exports.delete = async (command, callback) => {
    return await new Promise((resolve) => {
        command.delete()
            .then(() => {
                resolve(true);
                if (callback) callback(true);
                resolve(true);
            }).catch((err) => {
                if (callback) callback(err);
                console.log(err);
                resolve(false);
            });
    })
}


module.exports.help = {
    name: "guildCommand"
};