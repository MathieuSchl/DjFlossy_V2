module.exports.send = async (user, data, callback) => {
    return await new Promise((resolve) => {
        user.send(data).then((msg) => {
            if (callback) callback(msg);
            resolve(msg);
        }).catch((err) => {
            console.log(err);
            if (callback) callback(false);
            resolve(false);
        });
    })
}


module.exports.help = {
    name: "user"
};