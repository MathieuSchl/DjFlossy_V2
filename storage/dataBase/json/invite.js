module.exports.select = async (client, code, callback) => {
    const dbPrefix = await client.dataBase.get("dbConfiguration").getDbPrefix(client);
    client.dataBase.get("connection").exec(client.db, 'SELECT * FROM ?? WHERE `v_code` = ?', [dbPrefix + "invite", code], (error, results, fields) => {
        if (error && error.code === "ER_NO_SUCH_TABLE") {
            client.dataBase.get("connection").createTable(dbPrefix, "invite", () => {
                client.dataBase.get("invite").select(client, code, callback);
            });
            return;
        } else if (error) throw error;

        try {
            for (let index = 0; index < results.length; index++) {
                results[index].v_actionAdd = JSON.parse(results[index].v_actionAdd);
                results[index].v_data = JSON.parse(results[index].v_data);
            }
        } catch {}

        callback(error, results, fields);
        return;
    });
};

module.exports.selectAll = async (client, callback) => {
    const dbPrefix = await client.dataBase.get("dbConfiguration").getDbPrefix(client);
    client.dataBase.get("connection").exec(client.db, 'SELECT * FROM ??', [dbPrefix + "invite"], (error, results, fields) => {
        if (error && error.code === "ER_NO_SUCH_TABLE") {
            client.dataBase.get("connection").createTable(dbPrefix, "invite", () => {
                client.dataBase.get("invite").selectAll(client, callback);
            });
            return;
        } else if (error) throw error;

        try {
            for (let index = 0; index < results.length; index++) {
                results[index].v_actionAdd = JSON.parse(results[index].v_actionAdd);
                results[index].v_data = JSON.parse(results[index].v_data);
            }
        } catch {}

        callback(error, results, fields);
        return;
    });
};

module.exports.selectAllFromAGuild = async (client, idGuild, callback) => {
    const dbPrefix = await client.dataBase.get("dbConfiguration").getDbPrefix(client);
    client.dataBase.get("connection").exec(client.db, 'SELECT * FROM ?? WHERE `v_idGuild` = ?', [dbPrefix + "invite", idGuild], (error, results, fields) => {
        if (error && error.code === "ER_NO_SUCH_TABLE") {
            client.dataBase.get("connection").createTable(dbPrefix, "invite", () => {
                client.dataBase.get("invite").selectAllFromAGuild(client, idGuild, callback);
            });
            return;
        } else if (error) throw error;

        try {
            for (let index = 0; index < results.length; index++) {
                results[index].v_actionAdd = JSON.parse(results[index].v_actionAdd);
                results[index].v_data = JSON.parse(results[index].v_data);
            }
        } catch {}

        callback(error, results, fields);
        return;
    });
};

module.exports.insert = async (client, data, callback) => {
    const dbPrefix = await client.dataBase.get("dbConfiguration").getDbPrefix(client);
    if (data.v_emoji) data.v_emoji = client.basicFunctions.get("convertEmojiToString").emojiListToStringList(data.v_emoji); //convert emoji into sting
    client.dataBase.get("dbConfiguration").addAllParameterForInsert(data, (query, options) => {
        options.splice(0, 0, dbPrefix + "invite");

        client.dataBase.get("connection").exec(client.db, query, options, (error, results, fields) => {
            if (error && error.code === "ER_NO_SUCH_TABLE") {
                client.dataBase.get("connection").createTable(dbPrefix, "invite", () => {
                    client.basicFunctions.get("invite").insert(client, data, callback);
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
    const were = " WHERE `v_code` = ?";
    const v_code = data["v_code"];
    delete data["v_code"];
    delete data["v_idGuild"];
    client.dataBase.get("dbConfiguration").addAllParameterForUpdate(data, (query, options) => {
        query = query + were;
        options.splice(0, 0, dbPrefix + "invite");
        options.push(v_code);
        client.dataBase.get("connection").exec(client.db, query, options, (error, results, fields) => {
            if (error && error.code === "ER_NO_SUCH_TABLE") {
                client.dataBase.get("connection").createTable(dbPrefix, "invite", () => {
                    client.basicFunctions.get("invite").updateOneRow(client, data, callback);
                });
                return;
            }
            callback(error, results, fields);
            return;
        });
    });
    return;
};

module.exports.delete = async (client, code, callback) => {
    const dbPrefix = await client.dataBase.get("dbConfiguration").getDbPrefix(client);
    client.dataBase.get("connection").exec(client.db, "DELETE FROM ?? WHERE `v_code` = ?", [dbPrefix + "invite", code], (error, results, fields) => {
        if (error && error.code === "ER_NO_SUCH_TABLE") {
            client.dataBase.get("connection").createTable(dbPrefix, "invite", () => {
                client.dataBase.get("invite").delete(client, code, callback);
            });
            return;
        }
        callback(error, results, fields);
        return;
    });
};

module.exports.deleteAllInAGuild = async (client, idGuild, callback) => {
    const dbPrefix = await client.dataBase.get("dbConfiguration").getDbPrefix(client);
    client.dataBase.get("connection").exec(client.db, "DELETE FROM ?? WHERE `v_idGuild` = ?", [dbPrefix + "invite", idGuild], (error, results, fields) => {
        if (error && error.code === "ER_NO_SUCH_TABLE") {
            client.dataBase.get("connection").createTable(dbPrefix, "invite", () => {
                client.dataBase.get("invite").deleteAllInAGuild(client, idGuild, callback);
            });
            return;
        }
        callback(error, results, fields);
        return;
    });
};


module.exports.help = {
    name: "invite"
};