module.exports.run = async (client, invite) => {
    await new Promise((resolveSql) => {
        client.dataBase.get("invite").insert(client, {
            v_code: invite.code,
            v_idGuild: invite.guild.id,
            i_uses: invite.uses
        }, async (error, results, fields) => {
            if (error) throw error;
            resolveSql();
        })
    })
}

module.exports.help = {
    name: "inviteCreate"
};