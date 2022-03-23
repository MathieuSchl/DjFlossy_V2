const fs = require("fs");
const columnsName = require("./connection").getColumnsName("message");


module.exports.select = async (client, idMessage, callback) => {
    if (!fs.existsSync(client.location + "storage/data/message/")) fs.mkdirSync(client.location + "storage/data/message/");
    try {
        const file = fs.readFileSync(client.location + "storage/data/message/" + idMessage + ".json");
        const fileData = JSON.parse(file);
        callback(null, [fileData]);
    } catch (error) {
        callback(error)
    }
};

module.exports.selectAll = async (client, callback) => {
    if (!fs.existsSync(client.location + "storage/data/message/")) fs.mkdirSync(client.location + "storage/data/message/");

    const files = fs.readdirSync(client.location + "storage/data/message/");
    const jsonFiles = files.filter(f => f.split(".").pop() === "json");

    const res = [];
    for (const jsonFile of jsonFiles) {
        const file = fs.readFileSync(client.location + "storage/data/message/" + jsonFile);
        const fileData = JSON.parse(file);
        res.push(fileData);
    }
    callback(null, res);
    return res;
};

module.exports.selectAllFromAGuild = async (client, idGuild, callback) => {
    if (!fs.existsSync(client.location + "storage/data/message/")) fs.mkdirSync(client.location + "storage/data/message/");

    const files = fs.readdirSync(client.location + "storage/data/message/");
    const jsonFiles = files.filter(f => f.split(".").pop() === "json");

    const res = [];
    for (const jsonFile of jsonFiles) {
        const file = fs.readFileSync(client.location + "storage/data/message/" + jsonFile);
        const fileData = JSON.parse(file);
        if (fileData.v_idGuild === idGuild) res.push(fileData)
    }
    callback(null, res);
    return res;
};

module.exports.selectListOfElements = async (client, element, callback) => {
    if (!fs.existsSync(client.location + "storage/data/message/")) fs.mkdirSync(client.location + "storage/data/message/");

    const files = fs.readdirSync(client.location + "storage/data/message/");
    const jsonFiles = files.filter(f => f.split(".").pop() === "json");

    const res = [];
    for (const jsonFile of jsonFiles) {
        const file = fs.readFileSync(client.location + "storage/data/message/" + jsonFile);
        const fileData = JSON.parse(file);
        if (fileData.v_name_mess === element) res.push(fileData)
    }
    callback(null, res);
    return res;
};

module.exports.insert = async (client, data, callback) => {
    if (!fs.existsSync(client.location + "storage/data/message/")) fs.mkdirSync(client.location + "storage/data/message/");

    const dataToSave = {};
    for (let index = 0; index < columnsName.length; index++) {
        const element = columnsName[index];
        dataToSave[element.columnName] = data[element.columnName] ? data[element.columnName] : element.columnDefaultData;
    }
    const fileToSave = JSON.stringify(dataToSave);
    let error = null;
    if (data.v_id) fs.writeFileSync(client.location + "storage/data/message/" + data.v_id + ".json", fileToSave);
    else error = "v_id is not defined";
    callback(error);
    return error;
};

module.exports.updateOneRow = async (client, data, callback) => {
    if (!fs.existsSync(client.location + "storage/data/message/")) fs.mkdirSync(client.location + "storage/data/message/");

    const v_id = data["v_id"];
    if (v_id) {
        client.dataBase.get("message").select(client, v_id, (error, results, fields) => {
            if (error) throw error;
            delete data["v_id"];
            delete data["v_idChannel"];
            delete data["v_idGuild"];

            for (const result of results) {
                const keys = Object.keys(data);
                for (let index = 0; index < keys.length; index++) {
                    const element = data[keys[index]];
                    result[keys[index]] = element;
                }
                const fileToSave = JSON.stringify(result);
                fs.writeFileSync(client.location + "storage/data/message/" + result.v_id + ".json", fileToSave);
            }
            callback();
            return;
        })
    } else {
        callback("v_id is not defined");
        return "v_id is not defined";
    }
};

module.exports.updateFromGuild = async (client, data, callback) => {
    if (!fs.existsSync(client.location + "storage/data/message/")) fs.mkdirSync(client.location + "storage/data/message/");

    const v_idGuild = data["v_idGuild"];
    if (v_idGuild) {
        client.dataBase.get("message").selectAllFromAGuild(client, v_idGuild, (error, results, fields) => {
            if (error) throw error;
            delete data["v_id"];
            delete data["v_idChannel"];
            delete data["v_idGuild"];

            for (const result of results) {
                const keys = Object.keys(data);
                for (let index = 0; index < keys.length; index++) {
                    const element = data[keys[index]];
                    result[keys[index]] = element;
                }
                const fileToSave = JSON.stringify(result);
                fs.writeFileSync(client.location + "storage/data/message/" + result.v_id + ".json", fileToSave);
            }
            callback();
            return;
        })
    } else {
        callback("v_idGuild is not defined");
        return "v_idGuild is not defined";
    }
};

module.exports.delete = async (client, idMessage, callback) => {
    if (!fs.existsSync(client.location + "storage/data/message/")) fs.mkdirSync(client.location + "storage/data/message/");

    if (fs.existsSync(client.location + "storage/data/message/" + idMessage + ".json")) fs.unlinkSync(client.location + "storage/data/message/" + idMessage + ".json");
    callback();
    return;
};

module.exports.deleteAllInAGuild = async (client, idGuild, callback) => {
    if (!fs.existsSync(client.location + "storage/data/message/")) fs.mkdirSync(client.location + "storage/data/message/");

    const files = fs.readdirSync(client.location + "storage/data/message/");
    const jsonFiles = files.filter(f => f.split(".").pop() === "json");

    const res = [];
    for (const jsonFile of jsonFiles) {
        const file = fs.readFileSync(client.location + "storage/data/message/" + jsonFile);
        const fileData = JSON.parse(file);
        if (fileData.v_idGuild === idGuild) fs.unlinkSync(client.location + "storage/data/message/" + jsonFile);
    }
    callback(null);
    return;
};

module.exports.deleteListOfElements = async (client, element, callback) => {
    if (!fs.existsSync(client.location + "storage/data/message/")) fs.mkdirSync(client.location + "storage/data/message/");

    const files = fs.readdirSync(client.location + "storage/data/message/");
    const jsonFiles = files.filter(f => f.split(".").pop() === "json");

    const res = [];
    for (const jsonFile of jsonFiles) {
        const file = fs.readFileSync(client.location + "storage/data/message/" + jsonFile);
        const fileData = JSON.parse(file);
        if (element.includes(fileData.v_name_mess)) fs.unlinkSync(client.location + "storage/data/message/" + jsonFile);
    }
    callback(null);
    return;
};


module.exports.help = {
    name: "message"
};