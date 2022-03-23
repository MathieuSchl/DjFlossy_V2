const fs = require("fs");
const columnsName = require("./connection").getColumnsName("guild");


module.exports.select = async (client, idGuild, callback) => {
    if (!fs.existsSync(client.location + "storage/data/guild/")) fs.mkdirSync(client.location + "storage/data/guild/");
    try {
        const file = fs.readFileSync(client.location + "storage/data/guild/" + idGuild + ".json");
        const fileData = JSON.parse(file);
        callback(null, [fileData]);
    } catch (error) {
        callback(error)
    }
};

module.exports.selectAll = async (client, callback) => {
    if (!fs.existsSync(client.location + "storage/data/guild/")) fs.mkdirSync(client.location + "storage/data/guild/");

    const files = fs.readdirSync(client.location + "storage/data/guild/");
    const jsonFiles = files.filter(f => f.split(".").pop() === "json");

    const res = [];
    for (const jsonFile of jsonFiles) {
        const file = fs.readFileSync(client.location + "storage/data/guild/" + jsonFile);
        const fileData = JSON.parse(file);
        res.push(fileData);
    }
    callback(null, res);
    return res;
};

module.exports.insert = async (client, data, callback) => {
    if (!fs.existsSync(client.location + "storage/data/guild/")) fs.mkdirSync(client.location + "storage/data/guild/");

    const dataToSave = {};
    for (let index = 0; index < columnsName.length; index++) {
        const element = columnsName[index];
        dataToSave[element.columnName] = data[element.columnName] ? data[element.columnName] : element.columnDefaultData;
    }
    const fileToSave = JSON.stringify(dataToSave);
    let error = null;
    if (data.v_id) fs.writeFileSync(client.location + "storage/data/guild/" + data.v_id + ".json", fileToSave);
    else error = "v_id is not defined";
    callback(error);
    return error;
};

module.exports.updateOneRow = async (client, data, callback) => {
    if (!fs.existsSync(client.location + "storage/data/guild/")) fs.mkdirSync(client.location + "storage/data/guild/");

    const v_id = data["v_id"];
    if (v_id) {
        client.dataBase.get("guild").select(client, v_id, (error, results, fields) => {
            if (error) throw error;
            delete data["v_id"];

            for (const result of results) {
                const keys = Object.keys(data);
                for (let index = 0; index < keys.length; index++) {
                    const element = data[keys[index]];
                    result[keys[index]] = element;
                }
                const fileToSave = JSON.stringify(result);
                fs.writeFileSync(client.location + "storage/data/guild/" + result.v_id + ".json", fileToSave);
            }
            callback();
            return;
        })
    } else {
        callback("v_id is not defined");
        return "v_id is not defined";
    }
};

module.exports.delete = async (client, idGuild, callback) => {
    if (!fs.existsSync(client.location + "storage/data/guild/")) fs.mkdirSync(client.location + "storage/data/guild/");

    if (fs.existsSync(client.location + "storage/data/guild/" + idGuild + ".json")) fs.unlinkSync(client.location + "storage/data/guild/" + idGuild + ".json");
    callback();
    return;
};

module.exports.help = {
    name: "guild"
};