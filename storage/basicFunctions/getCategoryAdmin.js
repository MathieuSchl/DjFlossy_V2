const Guild = require("../discordToolsBox/guild");


module.exports.run = async (guild, callback) => {
    const client = guild.client;

    return await new Promise(async (resolve) => {
        client.dataBase.get("category").selectTypeFromGuild(client, guild.id, "admin", async (error, results, fields) => {
            if (error) throw error;

            if (results.length === 1) {
                const category = await Guild.fetchChannel(guild, results[0].v_id);
                resolve(category);
                if (callback) callback(category);
            } else if (results.length !== 0) {
                resolve(results);
                if (callback) callback(results);
            } else {
                const category = await Guild.createChannel(guild, "---ADMINS---", {
                    "type": "GUILD_CATEGORY",
                    "permissionOverwrites": [{
                        "id": guild.roles.everyone.id,
                        "deny": ["VIEW_CHANNEL"]
                    }]
                })
                client.dataBase.get("category").insert(client, {
                    "v_id": category.id,
                    "v_idGuild": guild.id,
                    "v_type": "admin",
                    "t_deleteifempty": true
                }, async (error, results, fields) => {
                    if (error) throw error;

                    resolve(category);
                    if (callback) callback(category);
                });
            }
        });
    })
}

module.exports.help = {
    name: "getCategoryAdmin"
};