const fs = require("fs");
const columnsName = require("./connection").getColumnsName("guildMembers");


module.exports.select = async (client, idUser, idGuild, callback) => {
    if (!fs.existsSync(client.location + "storage/data/guildMembers/")) fs.mkdirSync(client.location + "storage/data/guildMembers/");

    const idGuildMember = idGuild + "_" + idUser;
    try {
        const file = fs.readFileSync(client.location + "storage/data/guildMembers/" + idGuildMember + ".json");
        const fileData = JSON.parse(file);
        callback(null, [fileData]);
    } catch (error) {
        callback(error)
    }
};

module.exports.selectAll = async (client, callback) => {
    if (!fs.existsSync(client.location + "storage/data/guildMembers/")) fs.mkdirSync(client.location + "storage/data/guildMembers/");

    const files = fs.readdirSync(client.location + "storage/data/guildMembers/");
    const jsonFiles = files.filter(f => f.split(".").pop() === "json");

    const res = [];
    for (const jsonFile of jsonFiles) {
        const file = fs.readFileSync(client.location + "storage/data/guildMembers/" + jsonFile);
        const fileData = JSON.parse(file);
        res.push(fileData);
    }
    callback(null, res);
    return res;
};

module.exports.selectAllFromAGuild = async (client, idGuild, callback) => {
    if (!fs.existsSync(client.location + "storage/data/guildMembers/")) fs.mkdirSync(client.location + "storage/data/guildMembers/");

    const files = fs.readdirSync(client.location + "storage/data/guildMembers/");
    const jsonFiles = files.filter(f => f.split(".").pop() === "json");

    const res = [];
    for (const jsonFile of jsonFiles) {
        const file = fs.readFileSync(client.location + "storage/data/guildMembers/" + jsonFile);
        const fileData = JSON.parse(file);
        if (fileData.v_idGuild === idGuild) res.push(fileData);
    }
    callback(null, res);
    return res;
};

module.exports.insert = async (client, data, callback) => {
    if (!fs.existsSync(client.location + "storage/data/guildMembers/")) fs.mkdirSync(client.location + "storage/data/guildMembers/");

    const dataToSave = {};
    for (let index = 0; index < columnsName.length; index++) {
        const element = columnsName[index];
        dataToSave[element.columnName] = data[element.columnName] ? data[element.columnName] : element.columnDefaultData;
    }

    if (!dataToSave.v_idUser || !dataToSave.v_idGuild) {
        callback("v_idUser or v_idGuild is not defined");
        return error;
    }
    const idGuildMember = dataToSave.v_idGuild + "_" + dataToSave.v_idUser;
    dataToSave.i_id = idGuildMember;
    const fileToSave = JSON.stringify(dataToSave);
    let error = null;
    if (idGuildMember) fs.writeFileSync(client.location + "storage/data/guildMembers/" + idGuildMember + ".json", fileToSave);
    else error = "idGuildMember is not defined";
    callback(error);
    return error;
};

module.exports.updateOneRow = async (client, data, callback) => {
    if (!fs.existsSync(client.location + "storage/data/guildMembers/")) fs.mkdirSync(client.location + "storage/data/guildMembers/");

    const i_id = data["i_id"];
    if (i_id) {
        client.dataBase.get("guildMembers").select(client, data.v_idUser, data.v_idGuild, (error, results, fields) => {
            if (error) throw error;
            delete data["i_id"];
            delete data["v_idUser"];
            delete data["v_idGuild"];

            for (const result of results) {
                const keys = Object.keys(data);
                for (let index = 0; index < keys.length; index++) {
                    const element = data[keys[index]];
                    result[keys[index]] = element;
                }
                const fileToSave = JSON.stringify(result);
                fs.writeFileSync(client.location + "storage/data/guildMembers/" + result.i_id + ".json", fileToSave);
            }
            callback();
            return;
        })
    } else {
        callback("i_id is not defined");
        return "i_id is not defined";
    }
};

module.exports.delete = async (client, idUser, idGuild, callback) => {
    if (!fs.existsSync(client.location + "storage/data/guildMembers/")) fs.mkdirSync(client.location + "storage/data/guildMembers/");

    const idGuildMember = idGuild + "_" + idUser;
    if (fs.existsSync(client.location + "storage/data/guildMembers/" + idGuildMember + ".json")) fs.unlinkSync(client.location + "storage/data/guildMembers/" + idGuildMember + ".json");
    callback();
    return;
};

module.exports.deleteAllInAGuild = async (client, idGuild, callback) => {
    if (!fs.existsSync(client.location + "storage/data/guildMembers/")) fs.mkdirSync(client.location + "storage/data/guildMembers/");

    const files = fs.readdirSync(client.location + "storage/data/guildMembers/");
    const jsonFiles = files.filter(f => f.split(".").pop() === "json");

    const res = [];
    for (const jsonFile of jsonFiles) {
        const file = fs.readFileSync(client.location + "storage/data/guildMembers/" + jsonFile);
        const fileData = JSON.parse(file);
        if (fileData.v_idGuild === idGuild) fs.unlinkSync(client.location + "storage/data/guildMembers/" + jsonFile);
    }
    callback(null);
    return;
};

module.exports.help = {
    name: "guildMembers"
};