module.exports.run = async (client, playlistTag, playlistId) => {
    const dbPrefix = require("../dataBase/mariaDB/dbConfiguration").getDbPrefix(client);
    const db = client.db;
    console.log(dbPrefix);
};

module.exports.help = {
    name: "addNewMusic"
};