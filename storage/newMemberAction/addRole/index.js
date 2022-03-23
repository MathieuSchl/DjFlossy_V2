const GuildMember = require("../../discordToolsBox/guildMember")


module.exports.run = async (client, guildMember, newMemberData, userData) => {
    await GuildMember.addRole(guildMember, newMemberData.v_data.roleToAdd);
}

module.exports.help = {
    name: "index"
};