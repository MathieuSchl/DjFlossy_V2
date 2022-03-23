const Guild = require("../../discordToolsBox/guild");
const GuildMember = require("../../discordToolsBox/guildMember");
const getLanguageDataFunc = require("../../basicFunctions/getLanguageData");
const Interaction = require("../../discordToolsBox/interaction");


function getLanguageData(language, tag) {
    return getLanguageDataFunc.get({
        language: language,
        category: "globalFlags",
        type: null,
        tag: tag
    })
}


module.exports.run = async (client, interaction) => {
    const channel = interaction.channel;
    const guild = channel.guild;
    const user = interaction.member.user;
    const member = await Guild.fetchMembers(guild, user.id);
    if (!await GuildMember.hasPermission(member, "ADMINISTRATOR")) {
        client.dataBase.get("guild").select(client, guild.id, async (error, results, fields) => {
            if (error) throw error;

            const language = results[0].v_language ? results[0].v_language : client.config.defaultGuildLanguage ? client.config.defaultGuildLanguage : "en";
            await Interaction.editReply(interaction, {
                content: "<@" + user.id + ">, " + getLanguageData(language, "USER_CANT_USE_COMMAND")
            }, () => {
                const timeoutObj = setTimeout(() => {
                    Interaction.deleteReply(interaction);
                }, 10000);
                client.timeoutList.push(timeoutObj);
            })
        });
        return;
    }
    interaction.deleteReply();
    client.basicFunctions.get("stopProgram").stop(client, channel);
}


module.exports.help = {
    name: "index",
    ephemeral: false
};