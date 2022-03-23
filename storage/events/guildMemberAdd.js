const Client = require("../discordToolsBox/client");
const Guild = require("../discordToolsBox/guild");


async function executeFunctionFromInvite(client, guildMember, inviteInDb) {
    if (inviteInDb.v_actionAdd.length !== 0) {
        //action from invite
        for (let index = 0; index < inviteInDb.v_actionAdd.length; index++) {
            const element = inviteInDb.v_actionAdd[index];

            try {
                await client.newMemberAction[element].get("index").run(client, guildMember, inviteInDb, null);
            } catch (e) {
                console.log("newMemberAction '" + element + "' doesn't exist");
            }
        }
    } else {
        //action from guild
        client.dataBase.get("guild").select(client, inviteInDb.v_idGuild, async (error, results, fields) => {
            if (error) throw error;

            const result = results[0];
            for (let index = 0; index < result.v_actionAdd.length; index++) {
                const element = result.v_actionAdd[index];

                try {
                    await client.newMemberAction[element].get("index").run(client, guildMember, result, null);
                } catch (e) {
                    console.log("newMemberAction '" + element + "' doesn't exist");
                    console.log(e);
                }
            }
        });
    }
}

module.exports.addNewMemberInDb = async (client, guildMember) => {
    await new Promise((resolve) => {
        client.dataBase.get("user").select(client, guildMember.id, async (error, results, fields) => {
            if (error) throw error;

            if (results.length === 0) {
                await new Promise((resolveInsert) => {
                    const data = {
                        "v_id": guildMember.id,
                        "v_language": client.config.defaultUserLanguage,
                        "t_isbot": guildMember.user.bot
                    }
                    results.push(data);
                    client.dataBase.get("user").insert(client, data, (error, results, fields) => {
                        if (error) throw error;
                        resolveInsert();
                    })
                })
            }
            const result = results[0];
            client.dataBase.get("guildMembers").select(client, result.v_id, guildMember.guild.id, (error, results, fields) => {
                if (error) throw error;

                if (results.length === 0) {
                    client.dataBase.get("guildMembers").insert(client, {
                        "v_idUser": result.v_id,
                        "v_idGuild": guildMember.guild.id,
                        "t_allowedSpecialChannel": !guildMember.user.bot,
                        "v_language": result.v_language
                    }, (error, results, fields) => {
                        if (error) throw error;
                        resolve();
                    })
                } else {
                    resolve();
                }
            })
        });
    })
}

module.exports.run = async (client, guildMember) => {
    const guild = guildMember.guild;
    client.dataBase.get("invite").selectAllFromAGuild(client, guild.id, async (error, results, fields) => {
        if (error) throw error;
        const invitesCollection = await Guild.fetchInvite(guild);

        for (let index = 0; index < results.length; index++) {
            const element = results[index];

            try {
                const inviteFromCollection = invitesCollection.get(element.v_code);
                invitesCollection.delete(element.v_code);
                if (element.i_uses !== inviteFromCollection.uses) {
                    client.dataBase.get("invite").updateOneRow(client, {
                        "v_code": inviteFromCollection.code,
                        "i_uses": inviteFromCollection.uses
                    }, async (error, results, fields) => {
                        if (error) throw error;
                        executeFunctionFromInvite(client, guildMember, element);
                    })
                    break;
                }
            } catch (error) {
                executeFunctionFromInvite(client, guildMember, element);
            }
        }

        await client.events.get("guildMemberAdd").addNewMemberInDb(client, guildMember);
    })
}

module.exports.help = {
    name: "guildMemberAdd"
};