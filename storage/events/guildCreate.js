const Client = require("../discordToolsBox/client")


module.exports.run = async (client, guild) => {
    await new Promise(async (resolveSql) => {
        if (guild.constructor.name !== "Guild") {
            if (guild.constructor.name === "String") {
                guild = await Client.guildsFetch(client, guild);
            } else return;
        }
        const idGuild = guild.id;
        if (idGuild == null) return;
        client.dataBase.get("guild").insert(client, {
            v_id: idGuild,
            v_language: client.config.defaultGuildLanguage ? client.config.defaultGuildLanguage : "en"
        }, async (error, results, fields) => {
            if (error) throw error;
            await client.basicFunctions.get("fetchElementsForDb").fetchInvites(client, guild);
            await client.basicFunctions.get("fetchElementsForDb").fetchMembers(client, guild);
            resolveSql();
        })
    });
    
    const keys = Object.keys(client.guildCreateAction);
    for (const key of keys) {
        await client.guildCreateAction[key].get("index").run(client, guild);
    }
    client.basicFunctions.get("loadCommands").testCommands(guild);
}

module.exports.help = {
    name: "guildCreate"
};