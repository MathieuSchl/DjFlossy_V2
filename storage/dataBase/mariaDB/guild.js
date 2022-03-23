module.exports.select = async (client, idGuild, callback) => {
    const dbPrefix = await client.dataBase.get("dbConfiguration").getDbPrefix(client);
    client.dataBase.get("connection").exec(client.db, 'SELECT * FROM ?? WHERE `v_id` = ?', [dbPrefix + "guild", idGuild], (error, results, fields) => {
        if (error && error.code === "ER_NO_SUCH_TABLE") {
            client.dataBase.get("connection").createTable(dbPrefix, "guild", () => {
                client.dataBase.get("guild").select(client, idGuild, callback);
            });
            return;
        } else if (error) throw error;

        try {
            for (let index = 0; index < results.length; index++) {
                results[index].v_actionAdd = JSON.parse(results[index].v_actionAdd);
                results[index].v_actionRemove = JSON.parse(results[index].v_actionRemove);
                results[index].v_data = JSON.parse(results[index].v_data);
            }
        } catch {}

        callback(error, results, fields);
        return;
    });
};

module.exports.selectAll = async (client, callback) => {
    const dbPrefix = await client.dataBase.get("dbConfiguration").getDbPrefix(client);
    client.dataBase.get("connection").exec(client.db, 'SELECT * FROM ??', [dbPrefix + "guild"], (error, results, fields) => {
        if (error && error.code === "ER_NO_SUCH_TABLE") {
            client.dataBase.get("connection").createTable(dbPrefix, "guild", () => {
                client.dataBase.get("guild").selectAll(client, callback);
            });
            return;
        } else if (error) throw error;

        try {
            for (let index = 0; index < results.length; index++) {
                results[index].v_actionAdd = JSON.parse(results[index].v_actionAdd);
                results[index].v_actionRemove = JSON.parse(results[index].v_actionRemove);
                results[index].v_data = JSON.parse(results[index].v_data);
            }
        } catch {}

        callback(error, results, fields);
        return;
    });
};

module.exports.insert = async (client, data, callback) => {
    const dbPrefix = await client.dataBase.get("dbConfiguration").getDbPrefix(client);
    client.dataBase.get("dbConfiguration").addAllParameterForInsert(data, (query, options) => {
        options.splice(0, 0, dbPrefix + "guild");

        client.dataBase.get("connection").exec(client.db, query, options, (error, results, fields) => {
            if (error && error.code === "ER_NO_SUCH_TABLE") {
                client.dataBase.get("connection").createTable(dbPrefix, "guild", () => {
                    client.basicFunctions.get("guild").insert(client, data, callback);
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
    const were = " WHERE `v_id` = ? ";
    const v_id = data["v_id"];
    delete data["v_id"];
    client.dataBase.get("dbConfiguration").addAllParameterForUpdate(data, (query, options) => {
        query = query + were;
        options.splice(0, 0, dbPrefix + "guild");
        options.push(v_id);

        client.dataBase.get("connection").exec(client.db, query, options, (error, results, fields) => {
            if (error && error.code === "ER_NO_SUCH_TABLE") {
                client.dataBase.get("connection").createTable(dbPrefix, "guild", () => {
                    client.basicFunctions.get("guild").updateOneRow(client, data, callback);
                });
                return;
            }
            callback(error, results, fields);
            return;
        });
    });
    return;
};

module.exports.delete = async (client, idGuild, callback) => {
    const dbPrefix = await client.dataBase.get("dbConfiguration").getDbPrefix(client);
    client.dataBase.get("connection").exec(client.db, "DELETE FROM ?? WHERE `v_id` = ? ", [dbPrefix + "guild", idGuild], (error, results, fields) => {
        if (error && error.code === "ER_NO_SUCH_TABLE") {
            client.dataBase.get("connection").createTable(dbPrefix, "guild", () => {
                client.dataBase.get("guild").delete(client, idGuild, callback);
            });
            return;
        }
        callback(error, results, fields);
        return;
    });
};

module.exports.help = {
    name: "guild"
};