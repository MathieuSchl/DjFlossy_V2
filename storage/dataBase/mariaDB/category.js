module.exports.select = async (client, idCategory, callback) => {
    const dbPrefix = await client.dataBase.get("dbConfiguration").getDbPrefix(client);
    client.dataBase.get("connection").exec(client.db, 'SELECT * FROM ?? WHERE `v_id` = ?', [dbPrefix + "category", idCategory], (error, results, fields) => {
        if (error && error.code === "ER_NO_SUCH_TABLE") {
            client.dataBase.get("connection").createTable(dbPrefix, "category", () => {
                client.dataBase.get("category").select(client, idCategory, callback);
            });
            return;
        } else if (error) throw error;

        callback(error, results, fields);
        return;
    });
};

module.exports.selectAll = async (client, callback) => {
    const dbPrefix = await client.dataBase.get("dbConfiguration").getDbPrefix(client);
    client.dataBase.get("connection").exec(client.db, 'SELECT * FROM ??', [dbPrefix + "category"], (error, results, fields) => {
        if (error && error.code === "ER_NO_SUCH_TABLE") {
            client.dataBase.get("connection").createTable(dbPrefix, "category", () => {
                client.dataBase.get("category").selectAll(client, callback);
            });
            return;
        } else if (error) throw error;

        callback(error, results, fields);
        return;
    });
};

module.exports.selectTypeFromGuild = async (client, idGuild, type, callback) => {
    const dbPrefix = await client.dataBase.get("dbConfiguration").getDbPrefix(client);
    client.dataBase.get("connection").exec(client.db, 'SELECT * FROM ?? WHERE `v_idGuild` = ? AND `v_type` = ?', [dbPrefix + "category", idGuild, type], (error, results, fields) => {
        if (error && error.code === "ER_NO_SUCH_TABLE") {
            client.dataBase.get("connection").createTable(dbPrefix, "category", () => {
                client.dataBase.get("category").selectTypeFromGuild(client, idGuild, type, callback);
            });
            return;
        } else if (error) throw error;

        callback(error, results, fields);
        return;
    });
};

module.exports.insert = async (client, data, callback) => {
    const dbPrefix = await client.dataBase.get("dbConfiguration").getDbPrefix(client);
    client.dataBase.get("dbConfiguration").addAllParameterForInsert(data, (query, options) => {
        options.splice(0, 0, dbPrefix + "category");

        client.dataBase.get("connection").exec(client.db, query, options, (error, results, fields) => {
            if (error && error.code === "ER_NO_SUCH_TABLE") {
                client.dataBase.get("connection").createTable(dbPrefix, "category", () => {
                    client.basicFunctions.get("category").insert(client, data, callback);
                });
                return;
            }
            callback(error, results, fields);
            return;
        });
    });
    return;
};

module.exports.updateOneRow = async (client, data, callback) => {
    const dbPrefix = await client.dataBase.get("dbConfiguration").getDbPrefix(client);
    const were = " WHERE `v_id` = ?";
    const v_id = data["v_id"];
    delete data["v_id"];
    delete data["v_idGuild"];
    client.dataBase.get("dbConfiguration").addAllParameterForUpdate(data, (query, options) => {
        query = query + were;
        options.splice(0, 0, dbPrefix + "category");
        options.push(v_id);
        client.dataBase.get("connection").exec(client.db, query, options, (error, results, fields) => {
            if (error && error.code === "ER_NO_SUCH_TABLE") {
                client.dataBase.get("connection").createTable(dbPrefix, "category", () => {
                    client.basicFunctions.get("category").updateOneRow(client, data, callback);
                });
                return;
            }
            callback(error, results, fields);
            return;
        });
    });
    return;
};

module.exports.updateFromGuild = async (client, data, callback) => {
    const dbPrefix = await client.dataBase.get("dbConfiguration").getDbPrefix(client);
    const were = " WHERE `v_idGuild` = ?";
    const v_idGuild = data["v_idGuild"];
    delete data["v_id"];
    delete data["v_idGuild"];
    client.dataBase.get("dbConfiguration").addAllParameterForUpdate(data, (query, options) => {
        query = query + were;
        options.splice(0, 0, dbPrefix + "category");
        options.push(v_idGuild);
        client.dataBase.get("connection").exec(client.db, query, options, (error, results, fields) => {
            if (error && error.code === "ER_NO_SUCH_TABLE") {
                client.dataBase.get("connection").createTable(dbPrefix, "category", () => {
                    client.basicFunctions.get("category").updateFromGuild(client, data, callback);
                });
                return;
            }
            callback(error, results, fields);
            return;
        });
    });
    return;
};

module.exports.delete = async (client, idCategory, callback) => {
    const dbPrefix = await client.dataBase.get("dbConfiguration").getDbPrefix(client);
    client.dataBase.get("connection").exec(client.db, "DELETE FROM ?? WHERE `v_id` = ?", [dbPrefix + "category", idCategory], (error, results, fields) => {
        if (error && error.code === "ER_NO_SUCH_TABLE") {
            client.dataBase.get("connection").createTable(dbPrefix, "category", () => {
                client.dataBase.get("category").delete(client, idCategory, callback);
            });
            return;
        }
        callback(error, results, fields);
        return;
    });
};

module.exports.deleteAllInAGuild = async (client, idGuild, callback) => {
    const dbPrefix = await client.dataBase.get("dbConfiguration").getDbPrefix(client);
    client.dataBase.get("connection").exec(client.db, "DELETE FROM ?? WHERE `v_idGuild` = ?", [dbPrefix + "category", idGuild], (error, results, fields) => {
        if (error && error.code === "ER_NO_SUCH_TABLE") {
            client.dataBase.get("connection").createTable(dbPrefix, "category", () => {
                client.dataBase.get("category").deleteAllInAGuild(client, idGuild, callback);
            });
            return;
        }
        callback(error, results, fields);
        return;
    });
};

module.exports.help = {
    name: "category"
};