module.exports.setActivity = (object, options) => {
    if (object.constructor.name === "Client") object = object.user;
    if (object.constructor.name === "ClientUser") {
        object.setActivity(options);
    }
}

module.exports.help = {
    name: "clientUser"
};