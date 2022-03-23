module.exports.selectByPlayistName = async (client, playlistID, callback) => {
    const dbPrefix = await client.dataBase.get("dbConfiguration").getDbPrefix(client);
    if (!playlistID) playlistID = await new Promise((resolve) => {
        client.dataBase.get("connection").exec(client.db, "SELECT i_id FROM ?? WHERE b_enable = 1 AND i_user IS NULL ORDER BY RAND () LIMIT 1;", [dbPrefix + "musictag"], (error, results, fields) => {
            if (error && error.code === "ER_NO_SUCH_TABLE") {
                console.log("ERROR table musicsList or/and musicsCorrelation or/and musicTag unknown");
                return;
            } else if (error) throw error;

            return resolve(results[0].i_id);
        });
    })

    client.dataBase.get("connection").exec(client.db, "SELECT v_tagName AS tagName FROM ?? AS mc INNER JOIN ?? AS ml ON mc.i_idMusic = ml.i_id WHERE mc.`i_idTag` = ? ORDER BY RAND () LIMIT 50;", [dbPrefix + "musicscorrelation", dbPrefix + "musicslist", playlistID], (error, results, fields) => {
        if (error && error.code === "ER_NO_SUCH_TABLE") {
            /*
            client.dataBase.get("connection").createTable(dbPrefix, "musicsList", () => {
                client.dataBase.get("music").selectByPlayistName(client, playlistName, callback);
            });
            */
            console.log("ERROR table musicsList or/and musicsCorrelation or/and musicTag unknown");
            return;
        } else if (error) throw error;

        callback(error, results, fields);
        return;
    });
};


module.exports.help = {
    name: "music"
};