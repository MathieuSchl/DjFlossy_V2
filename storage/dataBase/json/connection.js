module.exports.open = (callback) => {
    callback(null);
}

module.exports.close = (db) => {}

module.exports.exec = (db, query, options, callback) => {};

module.exports.createTable = (dbPrefix, tableName, callback) => {};


//Function for the client
module.exports.createConnection = async (client, callback) => {
    callback();
};

module.exports.reaload = async (bot, callback) => {
    callback();
};

module.exports.getColumnsName = (tableName) => {
    const messageQuery = require("../mariaDB/dbQueries.json")[tableName];
    const elementsName = messageQuery.split('`');
    elementsName.splice(0, 1);
    elementsName.splice(elementsName.length - 2, 2);
    const res = [];
    for (let index = 0; index < elementsName.length; index = index + 2) {
        const columnName = elementsName[index];
        const columnData = elementsName[index + 1].split("DEFAULT").length === 1 ? null : elementsName[index + 1].split("'")[1];
        res.push({
            columnName: columnName,
            columnDefaultData: JSON.parse(columnData)
        })
    }
    return res;
};

module.exports.help = {
    name: "connection"
};