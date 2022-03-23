module.exports.selectAllEnable = async (client, callback) => {
    const dbPrefix = await client.dataBase.get("dbConfiguration").getDbPrefix(client);
    client.dataBase.get("connection").exec(client.db, 'SELECT * FROM ?? WHERE `b_enable` = 1', [dbPrefix + "musicTag"], (error, results, fields) => {
        if (error && error.code === "ER_NO_SUCH_TABLE") {
            client.dataBase.get("connection").createTable(dbPrefix, "musicTag", () => {
                client.dataBase.get("playlist").selectAllEnable(client, callback);
            });
            return;
        } else if (error) throw error;

        try {
            for (let index = 0; index < results.length; index++) {
                results[index].v_data = JSON.parse(results[index].v_data);
                results[index].v_emoji = client.basicFunctions.get("convertEmojiToString").stringListToEmojiList([results[index].v_emoji])[0];
            }
        } catch {}

        callback(error, results, fields);
        return;
    });
};

module.exports.selectById = async (client, id, callback) => {
    const dbPrefix = await client.dataBase.get("dbConfiguration").getDbPrefix(client);
    client.dataBase.get("connection").exec(client.db, 'SELECT * FROM ?? WHERE `b_enable` = 1 AND `i_id` = ?', [dbPrefix + "musicTag", id], (error, results, fields) => {
        if (error && error.code === "ER_NO_SUCH_TABLE") {
            client.dataBase.get("connection").createTable(dbPrefix, "musicTag", () => {
                client.dataBase.get("playlist").selectAllEnable(client, callback);
            });
            return;
        } else if (error) throw error;

        try {
            for (let index = 0; index < results.length; index++) {
                results[index].v_data = JSON.parse(results[index].v_data);
                results[index].v_emoji = client.basicFunctions.get("convertEmojiToString").stringListToEmojiList([results[index].v_emoji])[0];
            }
        } catch {}

        callback(error, results, fields);
        return;
    });
};


module.exports.help = {
    name: "playlist"
};