module.exports.select = async (client, idMessage, callback) => {
    const dbPrefix = await client.dataBase.get("dbConfiguration").getDbPrefix(client);
    client.dataBase.get("connection").exec(client.db, 'SELECT * FROM ?? WHERE `v_id` = ?', [dbPrefix + "message", idMessage], (error, results, fields) => {
        if (error && error.code === "ER_NO_SUCH_TABLE") {
            client.dataBase.get("connection").createTable(dbPrefix, "message", () => {
                client.dataBase.get("message").select(client, idMessage, callback);
            });
            return;
        } else if (error) throw error;

        try {
            for (let index = 0; index < results.length; index++) {
                results[index].v_emoji = JSON.parse(results[index].v_emoji);
                results[index].v_emoji = client.basicFunctions.get("convertEmojiToString").stringListToEmojiList(results[index].v_emoji);
                results[index].v_type = JSON.parse(results[index].v_type);
                results[index].v_data = JSON.parse(results[index].v_data);
            }
        } catch {}

        callback(error, results, fields);
        return;
    });
};

module.exports.selectAll = async (client, callback) => {
    const dbPrefix = await client.dataBase.get("dbConfiguration").getDbPrefix(client);
    client.dataBase.get("connection").exec(client.db, 'SELECT * FROM ??', [dbPrefix + "message"], (error, results, fields) => {
        if (error && error.code === "ER_NO_SUCH_TABLE") {
            client.dataBase.get("connection").createTable(dbPrefix, "message", () => {
                client.dataBase.get("message").selectAll(client, callback);
            });
            return;
        } else if (error) throw error;

        try {
            for (let index = 0; index < results.length; index++) {
                results[index].v_emoji = JSON.parse(results[index].v_emoji);
                results[index].v_emoji = client.basicFunctions.get("convertEmojiToString").stringListToEmojiList(results[index].v_emoji);
                results[index].v_type = JSON.parse(results[index].v_type);
                results[index].v_data = JSON.parse(results[index].v_data);
            }
        } catch {}

        callback(error, results, fields);
        return;
    });
};

module.exports.selectAllFromAGuild = async (client, idGuild, callback) => {
    const dbPrefix = await client.dataBase.get("dbConfiguration").getDbPrefix(client);
    client.dataBase.get("connection").exec(client.db, 'SELECT * FROM ?? WHERE `v_idGuild` = ?', [dbPrefix + "message", idGuild], (error, results, fields) => {
        if (error && error.code === "ER_NO_SUCH_TABLE") {
            client.dataBase.get("connection").createTable(dbPrefix, "message", () => {
                client.dataBase.get("message").selectAllFromAGuild(client, idGuild, callback);
            });
            return;
        } else if (error) throw error;

        try {
            for (let index = 0; index < results.length; index++) {
                results[index].v_emoji = JSON.parse(results[index].v_emoji);
                results[index].v_emoji = client.basicFunctions.get("convertEmojiToString").stringListToEmojiList(results[index].v_emoji);
                results[index].v_type = JSON.parse(results[index].v_type);
                results[index].v_data = JSON.parse(results[index].v_data);
            }
        } catch {}

        callback(error, results, fields);
        return;
    });
};

module.exports.selectListOfElements = async (client, element, callback) => {
    const dbPrefix = await client.dataBase.get("dbConfiguration").getDbPrefix(client);
    client.dataBase.get("dbConfiguration").addAllParametersForSelect(element, "v_name_mess", (query, options) => {
        options.splice(0, 0, dbPrefix + "message");

        client.dataBase.get("connection").exec(client.db, query, options, (error, results, fields) => {
            if (error && error.code === "ER_NO_SUCH_TABLE") {
                client.dataBase.get("connection").createTable(dbPrefix, "message", () => {
                    client.dataBase.get("message").selectListOfElements(client, element, callback);
                });
                return;
            } else if (error) throw error;

            try {
                for (let index = 0; index < results.length; index++) {
                    results[index].v_emoji = JSON.parse(results[index].v_emoji);
                    results[index].v_emoji = client.basicFunctions.get("convertEmojiToString").stringListToEmojiList(results[index].v_emoji);
                    results[index].v_type = JSON.parse(results[index].v_type);
                    results[index].v_data = JSON.parse(results[index].v_data);
                }
            } catch {}

            callback(error, results, fields);
            return;
        });
    })
    return;

};

module.exports.insert = async (client, data, callback) => {
    const dbPrefix = await client.dataBase.get("dbConfiguration").getDbPrefix(client);
    if (data.v_emoji) data.v_emoji = client.basicFunctions.get("convertEmojiToString").emojiListToStringList(data.v_emoji); //convert emoji into sting
    client.dataBase.get("dbConfiguration").addAllParameterForInsert(data, (query, options) => {
        options.splice(0, 0, dbPrefix + "message");

        client.dataBase.get("connection").exec(client.db, query, options, (error, results, fields) => {
            if (error && error.code === "ER_NO_SUCH_TABLE") {
                client.dataBase.get("connection").createTable(dbPrefix, "message", () => {
                    client.basicFunctions.get("message").insert(client, data, callback);
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
    delete data["v_idChannel"];
    delete data["v_idGuild"];
    if (data.v_emoji) data.v_emoji = client.basicFunctions.get("convertEmojiToString").emojiListToStringList(data.v_emoji); //convert emoji into sting
    client.dataBase.get("dbConfiguration").addAllParameterForUpdate(data, (query, options) => {
        query = query + were;
        options.splice(0, 0, dbPrefix + "message");
        options.push(v_id);
        client.dataBase.get("connection").exec(client.db, query, options, (error, results, fields) => {
            if (error && error.code === "ER_NO_SUCH_TABLE") {
                client.dataBase.get("connection").createTable(dbPrefix, "message", () => {
                    client.basicFunctions.get("message").updateOneRow(client, data, callback);
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
    delete data["v_idChannel"];
    delete data["v_idGuild"];
    if (data.v_emoji) data.v_emoji = client.basicFunctions.get("convertEmojiToString").emojiListToStringList(data.v_emoji); //convert emoji into sting
    client.dataBase.get("dbConfiguration").addAllParameterForUpdate(data, (query, options) => {
        query = query + were;
        options.splice(0, 0, dbPrefix + "message");
        options.push(v_idGuild);
        client.dataBase.get("connection").exec(client.db, query, options, (error, results, fields) => {
            if (error && error.code === "ER_NO_SUCH_TABLE") {
                client.dataBase.get("connection").createTable(dbPrefix, "message", () => {
                    client.basicFunctions.get("message").updateOneRow(client, data, callback);
                });
                return;
            }
            callback(error, results, fields);
            return;
        });
    });
    return;
};

module.exports.delete = async (client, idMessage, callback) => {
    const dbPrefix = await client.dataBase.get("dbConfiguration").getDbPrefix(client);
    client.dataBase.get("connection").exec(client.db, "DELETE FROM ?? WHERE `v_id` = ?", [dbPrefix + "message", idMessage], (error, results, fields) => {
        if (error && error.code === "ER_NO_SUCH_TABLE") {
            client.dataBase.get("connection").createTable(dbPrefix, "message", () => {
                client.dataBase.get("message").delete(client, idMessage, callback);
            });
            return;
        }
        callback(error, results, fields);
        return;
    });
};

module.exports.deleteAllInAGuild = async (client, idGuild, callback) => {
    const dbPrefix = await client.dataBase.get("dbConfiguration").getDbPrefix(client);
    client.dataBase.get("connection").exec(client.db, "DELETE FROM ?? WHERE `v_idGuild` = ?", [dbPrefix + "message", idGuild], (error, results, fields) => {
        if (error && error.code === "ER_NO_SUCH_TABLE") {
            client.dataBase.get("connection").createTable(dbPrefix, "message", () => {
                client.dataBase.get("message").deleteAllInAGuild(client, idGuild, callback);
            });
            return;
        }
        callback(error, results, fields);
        return;
    });
};

module.exports.deleteListOfElements = async (client, element, callback) => {
    const dbPrefix = await client.dataBase.get("dbConfiguration").getDbPrefix(client);
    client.dataBase.get("dbConfiguration").addAllParametersForDelete(element, "v_name_mess", (query, options) => {
        options.splice(0, 0, dbPrefix + "message");

        client.dataBase.get("connection").exec(client.db, query, options, (error, results, fields) => {
            if (error && error.code === "ER_NO_SUCH_TABLE") {
                client.dataBase.get("connection").createTable(dbPrefix, "message", () => {
                    client.dataBase.get("message").deleteListOfElements(client, element, callback);
                });
                return;
            }
            callback(error, results, fields);
            return;
        });
    })
    return;

};


module.exports.help = {
    name: "message"
};