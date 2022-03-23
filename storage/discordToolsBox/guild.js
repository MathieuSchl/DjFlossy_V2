module.exports.fetchMembers = async (guild, data, callback) => {
    return await new Promise((resolve, reject) => {
        guild.members.fetch(data).then((members) => {
            if (callback) callback(members);
            resolve(members);
        }).catch((err) => {
            console.log(err);
            if (callback) callback(false);
            resolve(false);
        });
    })
}

module.exports.createChannel = async (guild, name, options, callback) => {
    return await new Promise((resolve) => {
        guild.channels.create(name, options).then((channel) => {
            if (callback) callback(channel);
            resolve(channel);
        }).catch((err) => {
            console.log(err);
            if (callback) callback(false);
            resolve(false);
        });
    })
}

module.exports.fetchChannel = async (guild, data, callback) => {
    return await new Promise((resolve) => {
        guild.channels.fetch(data).then((channel) => {
            if (callback) callback(channel);
            resolve(channel);
        }).catch((err) => {
            console.log(err);
            if (callback) callback(false);
            resolve(false);
        });
    })
}

module.exports.fetchInvite = async (guild, data, callback) => {
    return await new Promise((resolve) => {
        guild.invites.fetch(data).then((channel) => {
            if (callback) callback(channel);
            resolve(channel);
        }).catch((err) => {
            if (callback) callback(false);
            resolve(false);
        });
    })
}

module.exports.createInvite = async (guild, channel, data, callback) => {
    return await new Promise((resolve) => {
        guild.invites.create(channel, data).then((invite) => {
            if (callback) callback(invite);
            resolve(invite);
        }).catch((err) => {
            if (callback) callback(false);
            resolve(false);
        });
    })
}


module.exports.help = {
    name: "guild"
};