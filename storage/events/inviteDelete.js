module.exports.run = async (client, invite) => {
    const codeInvite = invite.constructor.name === "Invite" ? invite.code : invite.constructor.name === "String" ? invite : null;
    await new Promise((resolveSql) => {
        client.dataBase.get("invite").delete(client, codeInvite, async (error, results, fields) => {
            if (error) throw error;
            resolveSql();
        })
    })
}

module.exports.help = {
    name: "inviteDelete"
};