const fs = require("fs")

module.exports.getDbPrefix = async (client) => {
    const config = require(client.location + "config.json");
    const prefix = config.dbPrefix;

    if (prefix == null) {
        config.dbPrefix = client.user.username + "_";

        let donnees = JSON.stringify(config);
        fs.writeFileSync(client.location + "/config.json", donnees);
        return config.dbPrefix;
    }
    return prefix;
};

module.exports.addAllParametersForSelect = async (data, columnName, callback) => {
    let query = "SELECT * FROM ?? WHERE";
    const options = [];
    for (let index = 0; index < data.length; index++) {
        const element = data[index];
        if (index === data.length - 1) {
            query = query + " `" + columnName + "` = ?";
        } else {
            query = query + " `" + columnName + "` = ? OR";
        }
        options.push(element)
    }
    callback(query, options)
};

module.exports.addAllParameterForInsert = async (data, callback) => {
    let query = "INSERT INTO ?? (";
    let values = " VALUES (";
    const options = [];
    const keys = Object.keys(data);
    const objectNotStringify = ["boolean", "string"];
    for (let index = 0; index < keys.length; index++) {
        const element = keys[index];
        if (index === keys.length - 1) {
            query = query + "`" + element + "`)";
            values = values + "?)";
        } else {
            query = query + "`" + element + "`, ";
            values = values + "?, ";
        }
        let option = null;
        try {
            if ((data[keys[index]] != null) && !(objectNotStringify.includes(typeof data[keys[index]]))) {
                option = JSON.stringify(data[keys[index]]);
            } else {
                option = data[keys[index]];
            }
        } catch (e) {
            option = data[keys[index]];
        }
        options.push(option)
    }
    callback(query + values, options)
};

module.exports.addAllParameterForUpdate = async (data, callback) => {
    let query = "UPDATE ?? SET ";
    const options = [];
    const keys = Object.keys(data);

    const objectNotStringify = ["boolean", "string"];
    for (let index = 0; index < keys.length; index++) {
        const element = keys[index];
        if (index === keys.length - 1) {
            query = query + "`" + element + "` = ?";
        } else {
            query = query + "`" + element + "` = ?, ";
        }
        let option = null;
        try {
            if ((data[keys[index]] != null) && !(objectNotStringify.includes(typeof data[keys[index]]))) {
                option = JSON.stringify(data[keys[index]]);
            } else {
                option = data[keys[index]];
            }
        } catch (e) {
            option = data[keys[index]];
        }
        options.push(option)
    }
    callback(query, options)
};

module.exports.addAllParametersForDelete = async (data, columnName, callback) => {
    let query = "DELETE FROM ?? WHERE";
    const options = [];
    for (let index = 0; index < data.length; index++) {
        const element = data[index];
        if (index === data.length - 1) {
            query = query + " `" + columnName + "` = ?";
        } else {
            query = query + " `" + columnName + "` = ? OR";
        }
        options.push(element)
    }
    callback(query, options)
};


module.exports.help = {
    name: "dbConfiguration"
};