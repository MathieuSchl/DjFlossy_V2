const fs = require("fs");
const columnsName = require("./connection").getColumnsName("category");


module.exports.select = async (client, idCategory, callback) => {
    if (!fs.existsSync(client.location + "storage/data/category/")) fs.mkdirSync(client.location + "storage/data/category/");
    try {
        const file = fs.readFileSync(client.location + "storage/data/category/" + idCategory + ".json");
        const fileData = JSON.parse(file);
        callback(null, [fileData]);
    } catch (error) {
        callback(error)
    }
};

module.exports.selectAll = async (client, callback) => {
    if (!fs.existsSync(client.location + "storage/data/category/")) fs.mkdirSync(client.location + "storage/data/category/");

    const files = fs.readdirSync(client.location + "storage/data/category/");
    const jsonFiles = files.filter(f => f.split(".").pop() === "json");

    const res = [];
    for (const jsonFile of jsonFiles) {
        const file = fs.readFileSync(client.location + "storage/data/category/" + jsonFile);
        const fileData = JSON.parse(file);
        res.push(fileData);
    }
    callback(null, res);
    return res;
};

module.exports.selectAllFromAGuild = async (client, idGuild, callback) => {
    if (!fs.existsSync(client.location + "storage/data/category/")) fs.mkdirSync(client.location + "storage/data/category/");

    const files = fs.readdirSync(client.location + "storage/data/category/");
    const jsonFiles = files.filter(f => f.split(".").pop() === "json");

    const res = [];
    for (const jsonFile of jsonFiles) {
        const file = fs.readFileSync(client.location + "storage/data/category/" + jsonFile);
        const fileData = JSON.parse(file);
        if (fileData.v_idGuild === idGuild) res.push(fileData)
    }
    callback(null, res);
    return res;
};

module.exports.selectTypeFromGuild = async (client, idGuild, type, callback) => {
    if (!fs.existsSync(client.location + "storage/data/category/")) fs.mkdirSync(client.location + "storage/data/category/");

    const files = fs.readdirSync(client.location + "storage/data/category/");
    const jsonFiles = files.filter(f => f.split(".").pop() === "json");

    const res = [];
    for (const jsonFile of jsonFiles) {
        const file = fs.readFileSync(client.location + "storage/data/category/" + jsonFile);
        const fileData = JSON.parse(file);
        if (fileData.v_idGuild === idGuild && fileData.v_type === type) res.push(fileData)
    }
    callback(null, res);
    return res;
};

module.exports.insert = async (client, data, callback) => {
    if (!fs.existsSync(client.location + "storage/data/category/")) fs.mkdirSync(client.location + "storage/data/category/");

    const dataToSave = {};
    for (let index = 0; index < columnsName.length; index++) {
        const element = columnsName[index];
        dataToSave[element.columnName] = data[element.columnName] ? data[element.columnName] : element.columnDefaultData;
    }
    const fileToSave = JSON.stringify(dataToSave);
    let error = null;
    if (data.v_id) fs.writeFileSync(client.location + "storage/data/category/" + data.v_id + ".json", fileToSave);
    else error = "v_id is not defined";
    callback(error);
    return error;
};

module.exports.updateOneRow = async (client, data, callback) => {
    if (!fs.existsSync(client.location + "storage/data/category/")) fs.mkdirSync(client.location + "storage/data/category/");

    const v_id = data["v_id"];
    if (v_id) {
        client.dataBase.get("category").select(client, v_id, (error, results, fields) => {
            if (error) throw error;
            delete data["v_id"];
            delete data["v_idGuild"];

            for (const result of results) {
                const keys = Object.keys(data);
                for (let index = 0; index < keys.length; index++) {
                    const element = data[keys[index]];
                    result[keys[index]] = element;
                }
                const fileToSave = JSON.stringify(result);
                fs.writeFileSync(client.location + "storage/data/category/" + result.v_id + ".json", fileToSave);
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
    if (!fs.existsSync(client.location + "storage/data/category/")) fs.mkdirSync(client.location + "storage/data/category/");

    const v_idGuild = data["v_idGuild"];
    if (v_idGuild) {
        client.dataBase.get("category").selectAllFromAGuild(client, v_idGuild, (error, results, fields) => {
            if (error) throw error;
            delete data["v_id"];
            delete data["v_idGuild"];

            for (const result of results) {
                const keys = Object.keys(data);
                for (let index = 0; index < keys.length; index++) {
                    const element = data[keys[index]];
                    result[keys[index]] = element;
                }
                const fileToSave = JSON.stringify(result);
                fs.writeFileSync(client.location + "storage/data/category/" + result.v_id + ".json", fileToSave);
            }
            callback();
            return;
        })
    } else {
        callback("v_idGuild is not defined");
        return "v_idGuild is not defined";
    }
};

module.exports.delete = async (client, idCategory, callback) => {
    if (!fs.existsSync(client.location + "storage/data/category/")) fs.mkdirSync(client.location + "storage/data/category/");

    if (fs.existsSync(client.location + "storage/data/category/" + idCategory + ".json")) fs.unlinkSync(client.location + "storage/data/category/" + idCategory + ".json");
    callback();
    return;
};

module.exports.deleteAllInAGuild = async (client, idGuild, callback) => {
    if (!fs.existsSync(client.location + "storage/data/category/")) fs.mkdirSync(client.location + "storage/data/category/");

    const files = fs.readdirSync(client.location + "storage/data/category/");
    const jsonFiles = files.filter(f => f.split(".").pop() === "json");

    const res = [];
    for (const jsonFile of jsonFiles) {
        const file = fs.readFileSync(client.location + "storage/data/category/" + jsonFile);
        const fileData = JSON.parse(file);
        if (fileData.v_idGuild === idGuild) fs.unlinkSync(client.location + "storage/data/category/" + jsonFile);
    }
    callback(null);
    return;
};

module.exports.help = {
    name: "category"
};