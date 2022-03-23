module.exports.create = async (guild, data, permissions, callback) => {
    return await new Promise((resolve) => {
        guild.commands.create(data).then((command) => {
            if (!permissions) {
                if (callback) callback(command);
                resolve(command);
            } else {
                guild.commands.permissions.set({
                    command: command.id,
                    permissions: permissions
                }).then(() => {
                    if (callback) callback(command);
                    resolve(command);
                }).catch((err) => {
                    console.log(err);
                    if (callback) callback(false);
                    resolve(false);
                });
            }
        }).catch((err) => {
            if (err.code !== 30034) console.log(err);
            if (callback) callback(false);
            resolve(false);
        });
    })
}

module.exports.fetch = async (guild, data, callback) => {
    return await new Promise((resolve) => {
        guild.commands.fetch(data)
            .then((command) => {
                if (callback) callback(command);
                resolve(command);
            }).catch((err) => {
                console.log(err);
                if (callback) callback(false);
                resolve(false);
            });
    })
}

module.exports.delete = async (command, callback) => {
    return await new Promise((resolve) => {
        command.delete().then(() => {
            if (callback) callback(true);
            resolve(true);
        }).catch((err) => {
            console.log(err);
            if (callback) callback(false);
            resolve(false);
        });
    })
}


module.exports.help = {
    name: "guildCommand"
};