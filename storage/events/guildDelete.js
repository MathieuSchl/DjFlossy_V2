module.exports.run = async (client, guild) => {
    const guildData = await new Promise((resolveSql) => {
        const idGuild = guild.constructor.name === "Guild" ? guild.id : guild.constructor.name === "String" ? guild : null;
        if (idGuild == null) return;



        client.dataBase.get("guild").select(client, idGuild, async (error, results, fields) => {
            if (error) throw error;
            const guildData = results[0];

            //Delete Guild
            client.dataBase.get("guild").delete(client, idGuild, async (error, results, fields) => {
                if (error) throw error;

                //Delete textChannels
                client.dataBase.get("textChannel").deleteAllInAGuild(client, idGuild, async (error, results, fields) => {
                    if (error) throw error;

                    //Delete messages
                    if (error) throw error;
                    client.dataBase.get("message").deleteAllInAGuild(client, idGuild, async (error, results, fields) => {
                        if (error) throw error;

                        //Delete guildMembers
                        client.dataBase.get("guildMembers").deleteAllInAGuild(client, idGuild, async (error, results, fields) => {
                            if (error) throw error;

                            //Delete invites from a guild
                            client.dataBase.get("invite").deleteAllInAGuild(client, idGuild, async (error, results, fields) => {
                                if (error) throw error;

                                resolveSql(guildData);
                            })
                        })
                    })
                })
            })
        })
    });

    const keys = Object.keys(client.guildDeleteAction);
    for (const key of keys) {
        await client.guildDeleteAction[key].get("index").run(client, guild, guildData);
    }
}

module.exports.help = {
    name: "guildDelete"
};