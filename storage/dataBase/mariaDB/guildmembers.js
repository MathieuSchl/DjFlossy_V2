module.exports.select = async (client, idUser, idGuild, callback) => {
    const dbPrefix = await client.dataBase.get("dbConfiguration").getDbPrefix(client);
    client.dataBase.get("connection").exec(client.db, 'SELECT * FROM ?? WHERE `v_idUser` = ? AND `v_idGuild` = ?', [dbPrefix + "guildMembers", idUser, idGuild], (error, results, fields) => {
        if (error && error.code === "ER_NO_SUCH_TABLE") {
            client.dataBase.get("connection").createTable(dbPrefix, "guildMembers", () => {
                client.dataBase.get("guildMembers").select(client, idUser, idGuild, callback);
            });
            return;
        } else if (error) throw error;

        try {
            for (let index = 0; index < results.length; index++) {
                results[index].v_data = JSON.parse(results[index].v_data);
            }
        } catch {}

        callback(error, results, fields);
        return;
    });
};

module.exports.selectAll = async (client, callback) => {
    const dbPrefix = await client.dataBase.get("dbConfiguration").getDbPrefix(client);
    client.dataBase.get("connection").exec(client.db, 'SELECT * FROM ??', [dbPrefix + "guildMembers"], (error, results, fields) => {
        if (error && error.code === "ER_NO_SUCH_TABLE") {
            client.dataBase.get("connection").createTable(dbPrefix, "guildMembers", () => {
                client.dataBase.get("guildMembers").selectAll(client, callback);
            });
            return;
        } else if (error) throw error;

        try {
            for (let index = 0; index < results.length; index++) {
                results[index].v_data = JSON.parse(results[index].v_data);
            }
        } catch {}

        callback(error, results, fields);
        return;
    });
};

module.exports.selectAllFromAGuild = async (client, idGuild, callback) => {
    const dbPrefix = await client.dataBase.get("dbConfiguration").getDbPrefix(client);
    client.dataBase.get("connection").exec(client.db, 'SELECT * FROM ?? WHERE`v_idGuild` = ?', [dbPrefix + "guildMembers", idGuild], (error, results, fields) => {
        if (error && error.code === "ER_NO_SUCH_TABLE") {
            client.dataBase.get("connection").createTable(dbPrefix, "guildMembers", () => {
                client.dataBase.get("guildMembers").selectAllFromAGuild(client, idGuild, callback);
            });
            return;
        } else if (error) throw error;

        try {
            for (let index = 0; index < results.length; index++) {
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
        options.splice(0, 0, dbPrefix + "guildMembers");

        client.dataBase.get("connection").exec(client.db, query, options, (error, results, fields) => {
            if (error && error.code === "ER_NO_SUCH_TABLE") {
                client.dataBase.get("connection").createTable(dbPrefix, "guildMembers", () => {
                    client.basicFunctions.get("guildMembers").insert(client, data, callback);
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
    const were = " WHERE `v_idUser` = ? AND `v_idGuild` = ?";
    const v_idUser = data["v_idUser"];
    const v_idGuild = data["v_idGuild"];
    delete data["i_id"];
    delete data["v_idUser"];
    delete data["v_idGuild"];
    client.dataBase.get("dbConfiguration").addAllParameterForUpdate(data, (query, options) => {
        query = query + were;
        options.splice(0, 0, dbPrefix + "guildMembers");
        options.push(v_idUser);
        options.push(v_idGuild);
        client.dataBase.get("connection").exec(client.db, query, options, (error, results, fields) => {
            if (error && error.code === "ER_NO_SUCH_TABLE") {
                client.dataBase.get("connection").createTable(dbPrefix, "guildMembers", () => {
                    client.basicFunctions.get("guildMembers").updateOneRow(client, data, callback);
                });
                return;
            }
            callback(error, results, fields);
            return;
        });
    });
    return;
};

module.exports.delete = async (client, idUser, idGuild, callback) => {
    const dbPrefix = await client.dataBase.get("dbConfiguration").getDbPrefix(client);
    client.dataBase.get("connection").exec(client.db, "DELETE FROM ?? WHERE `v_idUser` = ? AND `v_idGuild` = ?", [dbPrefix + "guildMembers", idUser, idGuild], (error, results, fields) => {
        if (error && error.code === "ER_NO_SUCH_TABLE") {
            client.dataBase.get("connection").createTable(dbPrefix, "guildMembers", () => {
                client.dataBase.get("guildMembers").delete(client, idUser, idGuild, callback);
            });
            return;
        }
        callback(error, results, fields);
        return;
    });
};

module.exports.deleteAllInAGuild = async (client, idGuild, callback) => {
    const dbPrefix = await client.dataBase.get("dbConfiguration").getDbPrefix(client);
    client.dataBase.get("connection").exec(client.db, "DELETE FROM ?? WHERE `v_idGuild` = ?", [dbPrefix + "guildMembers", idGuild], (error, results, fields) => {
        if (error && error.code === "ER_NO_SUCH_TABLE") {
            client.dataBase.get("connection").createTable(dbPrefix, "guildMembers", () => {
                client.dataBase.get("guildMembers").deleteAllInAGuild(client, idGuild, callback);
            });
            return;
        }
        callback(error, results, fields);
        return;
    });
};

module.exports.help = {
    name: "guildMembers"
};