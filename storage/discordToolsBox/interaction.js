module.exports.deferReply = async (interaction, data, callback) => {
    return await new Promise((resolve) => {
        interaction.deferReply(data).then(() => {
            if (callback) callback();
            resolve();
        }).catch((err) => {
            if (callback) callback(err);
            console.log(err);
            resolve(false);
        })
    })
}

module.exports.reply = async (interaction, data, callback) => {
    return await new Promise((resolve) => {
        interaction.reply(data).then((msg) => {
            if (callback) callback(msg);
            resolve(msg);
            resolve();
        }).catch((err) => {
            if (callback) callback(err);
            console.log(err);
            resolve(false);
        })
    })
}

module.exports.editReply = async (interaction, data, callback) => {
    return await new Promise(async (resolve) => {
        await interaction.editReply(data).then(() => {
            if (callback) callback();
            resolve();
        }).catch((err) => {
            if (callback) callback(err);
            console.log(err);
            resolve(false);
        })
    })
}

module.exports.deleteReply = async (interaction, callback) => {
    return await new Promise(async(resolve) => {
        await interaction.deleteReply().then(() => {
            if (callback) callback();
            resolve();
        }).catch((err) => {
            if (callback) callback(err);
            console.log(err);
            resolve(false);
        })
    })
}


module.exports.help = {
    name: "interaction"
};