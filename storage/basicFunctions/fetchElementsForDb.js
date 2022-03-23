const Client = require("../discordToolsBox/client");
const Guild = require("../discordToolsBox/guild");
const Channel = require("../discordToolsBox/channel");

async function deleteElementInList(list, id) {
    for (let index = 0; index < list.length; index++) {
        const element = list[index][0];
        if (element === id) {
            list.splice(index, 1);
            break;
        }
    }
}

//Fetch invites
module.exports.fetchInvites = async (client, guild) => {
    await new Promise((resolve) => {
        client.dataBase.get("invite").selectAllFromAGuild(client, guild.id, async (error, results, fields) => {
            if (error) throw error;

            const invitesCollection = await Guild.fetchInvite(guild);
            const allInvites = Array.from(invitesCollection);
            for (let index = 0; index < results.length; index++) {
                const element = results[index];
                const codeInvite = element.v_code;
                if (invitesCollection.get(codeInvite) == null) {
                    await client.events.get("inviteDelete").run(client, codeInvite);
                } else {
                    await deleteElementInList(allInvites, codeInvite);
                    //uptdate the number of invite use in db
                    const invite = await Guild.fetchInvite(guild, codeInvite);
                    if (invite.uses !== element.i_uses) {
                        client.dataBase.get("invite").updateOneRow(client, {
                            "v_code": codeInvite,
                            "i_uses": invite.uses
                        }, async (error, results, fields) => {
                            if (error) throw error;
                        })
                    }
                }
            }

            for (let index = 0; index < allInvites.length; index++) {
                const element = allInvites[index][1];

                await client.events.get("inviteCreate").run(client, element);
            }
            resolve();
        })
    })
}

//Fetch members
module.exports.fetchMembers = async (client, guild) => {
    await new Promise((resolve) => {
        client.dataBase.get("guildMembers").selectAllFromAGuild(client, guild.id, async (error, results, fields) => {
            if (error) throw error;

            const membersCollection = await Guild.fetchMembers(guild);
            const allMembers = Array.from(membersCollection);
            for (let index = 0; index < results.length; index++) {
                const element = results[index];
                const idMember = element.i_id;
                if (membersCollection.get(idMember) == null) {
                    await client.events.get("guildMemberRemove").run(client, [idMember, guild.id]);
                } else {
                    await deleteElementInList(allMembers, idMember);
                }
            }

            for (let index = 0; index < allMembers.length; index++) {
                const element = allMembers[index][1];

                await client.events.get("guildMemberAdd").run(client, element);
            }
            resolve();
        })
    })
}

module.exports.run = async (client) => {
    //Fetch categoryChannels
    await new Promise((resolve) => {
        client.dataBase.get("category").selectAll(client, async (error, results, fields) => {
            if (error) throw error;
            for (let index = 0; index < results.length; index++) {
                const element = results[index].v_id;
                const channel = await Client.channelFetch(client, element);
                if (!channel) {
                    client.dataBase.get("category").delete(client, element, async (error, results, fields) => {
                        if (error) {
                            console.log(error);
                        }
                    });
                }
            }
            resolve();
        })
    })

    //Fetch textChannels
    await new Promise((resolve) => {
        client.dataBase.get("textChannel").selectAll(client, async (error, results, fields) => {
            if (error) throw error;
            for (let index = 0; index < results.length; index++) {
                const element = results[index].v_id;
                const channel = await Client.channelFetch(client, element);
                if (!channel) {
                    client.dataBase.get("textChannel").delete(client, element, async (error, results, fields) => {
                        if (error) {
                            console.log(error);
                        }
                    });
                }
            }
            resolve();
        })
    })

    //Fetch messages
    await new Promise((resolve) => {
        client.dataBase.get("message").selectAll(client, async (error, results, fields) => {
            if (error) throw error;
            for (let index = 0; index < results.length; index++) {
                const element = results[index];
                const channel = await Client.channelFetch(client, element.v_idChannel);
                if (!channel) {
                    client.dataBase.get("message").delete(client, element.v_id, async (error, results, fields) => {
                        if (error) {
                            console.log(error);
                        }
                    });
                } else {
                    const messagesCollection = await Channel.messagesFetch(channel, element.v_id);
                    if (!messagesCollection) {
                        client.dataBase.get("message").delete(client, element.v_id, async (error, results, fields) => {
                            if (error) {
                                console.log(error);
                            }
                        });
                    }
                }
            }
            resolve();
        })
    })

    //Fetch guilds
    await new Promise((resolve) => {
        client.dataBase.get("guild").selectAll(client, async (error, results, fields) => {
            if (error) throw error;

            const guildsCollection = await Client.guildsFetch(client);
            if (!guildsCollection) return;
            const allGuilds = Array.from(guildsCollection);
            for (let index = 0; index < results.length; index++) {
                const element = results[index];
                const idGuild = element.v_id;
                if (guildsCollection.get(idGuild) == null) {
                    await new Promise(async (resolveSql) => {

                        await client.events.get("guildDelete").run(client, idGuild);
                        resolveSql();
                    });
                } else {
                    await deleteElementInList(allGuilds, idGuild);
                    const guild = await Client.guildsFetch(client, idGuild);
                    await client.basicFunctions.get("fetchElementsForDb").fetchInvites(client, guild);
                    await client.basicFunctions.get("fetchElementsForDb").fetchMembers(client, guild);
                }
            }
            //console.log(allGuilds);
            for (let index = 0; index < allGuilds.length; index++) {
                const element = allGuilds[index][0];

                await new Promise(async (resolveSql) => {
                    const timeoutObj = setTimeout(async () => {
                        await client.events.get("guildCreate").run(client, element);
                    }, 3000);
                    client.timeoutList.push(timeoutObj);
                    const guild = await Client.guildsFetch(client, element);
                    await client.basicFunctions.get("fetchElementsForDb").fetchInvites(client, guild);
                    await client.basicFunctions.get("fetchElementsForDb").fetchMembers(client, guild);
                    resolveSql();
                });
            }
            resolve();
        })
    })

    //Fetch guildMembers
};

module.exports.help = {
    name: "fetchElementsForDb"
};