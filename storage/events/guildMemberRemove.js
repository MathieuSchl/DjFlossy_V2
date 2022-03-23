module.exports.run = async (client, guildMember) => {
    let guildMemberId, guildId;
    if (guildMember.constructor.name === "GuildMember") {
        guildMemberId = guildMember.id;
        guildId = guildMember.guild.id;
    } else {
        guildMemberId = guildMember[0];
        guildId = guildMember[1];
    }
    client.dataBase.get("guildMembers").delete(client, guildMemberId, guildId, async (error, results, fields) => {
        if (error) throw error;
    })
}

module.exports.help = {
    name: "guildMemberRemove"
};