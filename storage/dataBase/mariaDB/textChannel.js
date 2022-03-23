module.exports.select = async (client, idChannel, callback) => {
    const dbPrefix = await client.dataBase.get("dbConfiguration").getDbPrefix(client);
    client.dataBase.get("connection").exec(client.db, 'SELECT * FROM ?? WHERE `v_id` = ?', [dbPrefix + "textChannel", idChannel], (error, results, fields) => {
        if (error && error.code === "ER_NO_SUCH_TABLE") {
            client.dataBase.get("connection").createTable(dbPrefix, "textChannel", () => {
                client.dataBase.get("textChannel").select(client, idChannel, callback);
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
    client.dataBase.get("connection").exec(client.db, 'SELECT * FROM ??', [dbPrefix + "textChannel"], (error, results, fields) => {
        if (error && error.code === "ER_NO_SUCH_TABLE") {
            client.dataBase.get("connection").createTable(dbPrefix, "textChannel", () => {
                client.dataBase.get("textChannel").selectAll(client, callback);
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

module.exports.selectListOfElements = async (client, element, callback) => {
    const dbPrefix = await client.dataBase.get("dbConfiguration").getDbPrefix(client);
    client.dataBase.get("dbConfiguration").addAllParametersForSelect(element, "v_type", (query, options) => {
        options.splice(0, 0, dbPrefix + "textChannel");

        client.dataBase.get("connection").exec(client.db, query, options, (error, results, fields) => {
            if (error && error.code === "ER_NO_SUCH_TABLE") {
                client.dataBase.get("connection").createTable(dbPrefix, "textChannel", () => {
                    client.dataBase.get("textChannel").selectListOfElements(client, element, callback);
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
    })
    return;
};

module.exports.selectATypeOfChannelInGuild = async (client, idGuild, type, callback) => {
    const dbPrefix = await client.dataBase.get("dbConfiguration").getDbPrefix(client);
    client.dataBase.get("connection").exec(client.db, 'SELECT * FROM ?? WHERE `v_idGuild` = ? AND `v_type` = ?', [dbPrefix + "textChannel", idGuild, type], (error, results, fields) => {
        if (error && error.code === "ER_NO_SUCH_TABLE") {
            client.dataBase.get("connection").createTable(dbPrefix, "textChannel", () => {
                client.dataBase.get("textChannel").selectATypeOfChannelInGuild(client, idGuild, type, callback);
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
        options.splice(0, 0, dbPrefix + "textChannel");

        client.dataBase.get("connection").exec(client.db, query, options, (error, results, fields) => {
            if (error && error.code === "ER_NO_SUCH_TABLE") {
                client.dataBase.get("connection").createTable(dbPrefix, "textChannel", () => {
                    client.basicFunctions.get("textChannel").insert(client, data, callback);
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
        options.splice(0, 0, dbPrefix + "textChannel");
        options.push(v_id);
        client.dataBase.get("connection").exec(client.db, query, options, (error, results, fields) => {
            if (error && error.code === "ER_NO_SUCH_TABLE") {
                client.dataBase.get("connection").createTable(dbPrefix, "textChannel", () => {
                    client.basicFunctions.get("textChannel").updateOneRow(client, data, callback);
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
        options.splice(0, 0, dbPrefix + "textChannel");
        options.push(v_idGuild);
        client.dataBase.get("connection").exec(client.db, query, options, (error, results, fields) => {
            if (error && error.code === "ER_NO_SUCH_TABLE") {
                client.dataBase.get("connection").createTable(dbPrefix, "textChannel", () => {
                    client.basicFunctions.get("textChannel").updateOneRow(client, data, callback);
                });
                return;
            }
            callback(error, results, fields);
            return;
        });
    });
    return;
};

module.exports.delete = async (client, idChannel, callback) => {
    const dbPrefix = await client.dataBase.get("dbConfiguration").getDbPrefix(client);
    client.dataBase.get("connection").exec(client.db, "DELETE FROM ?? WHERE `v_id` = ?", [dbPrefix + "textChannel", idChannel], (error, results, fields) => {
        if (error && error.code === "ER_NO_SUCH_TABLE") {
            client.dataBase.get("connection").createTable(dbPrefix, "textChannel", () => {
                client.dataBase.get("textChannel").delete(client, idChannel, callback);
            });
            return;
        }
        callback(error, results, fields);
        return;
    });
};

module.exports.deleteAllInAGuild = async (client, idGuild, callback) => {
    const dbPrefix = await client.dataBase.get("dbConfiguration").getDbPrefix(client);
    client.dataBase.get("connection").exec(client.db, "DELETE FROM ?? WHERE `v_idGuild` = ?", [dbPrefix + "textChannel", idGuild], (error, results, fields) => {
        if (error && error.code === "ER_NO_SUCH_TABLE") {
            client.dataBase.get("connection").createTable(dbPrefix, "textChannel", () => {
                client.dataBase.get("textChannel").deleteAllInAGuild(client, idGuild, callback);
            });
            return;
        }
        callback(error, results, fields);
        return;
    });
};

module.exports.deleteListOfElements = async (client, element, callback) => {
    const dbPrefix = await client.dataBase.get("dbConfiguration").getDbPrefix(client);
    client.dataBase.get("dbConfiguration").addAllParametersForDelete(element, "v_type", (query, options) => {
        options.splice(0, 0, dbPrefix + "textChannel");

        client.dataBase.get("connection").exec(client.db, query, options, (error, results, fields) => {
            if (error && error.code === "ER_NO_SUCH_TABLE") {
                client.dataBase.get("connection").createTable(dbPrefix, "textChannel", () => {
                    client.dataBase.get("textChannel").selectListOfElements(client, element, callback);
                });
                return;
            } else if (error) throw error;

            callback(error, results, fields);
            return;
        });
    })
    return;
};

module.exports.help = {
    name: "textChannel"
};