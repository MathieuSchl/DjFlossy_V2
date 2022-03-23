module.exports.hasPermission = async (member, data, callback) => {
    const res = member.permissions.has(data);
    if (callback) callback(res);
    return res;
}

module.exports.addRole = async (member, data, callback) => {
    return await new Promise((resolve) => {
        member.roles.add(data).then((member) => {
            if (callback) callback(member);
            resolve(member);
        })
    }).catch((err) => {
        console.log(err);
        if (callback) callback(false);
        resolve(false);
    });
}

module.exports.removeRole = async (member, data, callback) => {
    return await new Promise((resolve) => {
        member.roles.remove(data).then((member) => {
            if (callback) callback(member);
            resolve(member);
        }).catch((err) => {
            console.log(err);
            if (callback) callback(false);
            resolve(false);
        });
    })
}

module.exports.edit = async (member, data, callback) => {
    return await new Promise((resolve) => {
        member.edit(data).then((member) => {
            if (callback) callback(member);
            resolve(member);
        }).catch((err) => {
            console.log(err);
            if (callback) callback(false);
            resolve(false);
        });
    })
}


module.exports.help = {
    name: "guildMember"
};