const getCommandNames = () => {
    const languageData = require("../../language.json");
    const language = Object.keys(languageData);
    const res = {};
    for (let index = 0; index < language.length; index++) {
        const element = language[index];
        res[element] = {};
        res[element]["command"] = {};
        const commandsName = Object.keys(languageData[element]["command"]);
        for (let index = 0; index < commandsName.length; index++) {
            const commandName = commandsName[index];
            const commandTrad = languageData[element]["command"][commandName]["NAME"];
            res[element]["command"][commandTrad] = commandName;
        }
    }
    return res;
}
const commandNames = getCommandNames();


async function getLanguageForGuild(guild) {
    return await new Promise((resolve) => {
        guild.client.dataBase.get("guild").select(guild.client, guild.id, (error, results, fields) => {
            if (error) throw error;

            resolve(results[0].v_language)
        });
    })
}

module.exports.run = async (client, interaction) => {
    const language = interaction.guildId ? await getLanguageForGuild(interaction.guild) : client.config.defaultGuildLanguage ? client.config.defaultGuildLanguage : "en";
    const interactionCommandName = commandNames[language]["command"][interaction.commandName];
    const interactionCommandNameToUse = interactionCommandName ? interactionCommandName : interaction.commandName;
    const guild = interaction.channel.guild;
    const guildData = await new Promise((resolve) => {
        client.dataBase.get("guild").select(client, guild.id, (error, results, fields) => {
            if (error) throw error;

            resolve(results[0])
        });
    })
    const user = interaction.user;
    const userData = await new Promise((resolve) => {
        client.dataBase.get("guildMembers").select(client, user.id, guild.id, (error, results, fields) => {
            if (error) throw error;

            resolve(results[0])
        });
    })
    try {
        client.command[interactionCommandNameToUse].get("index").run(client, interaction, user, userData, guild, guildData);
    } catch (e) {
        console.log("command '" + interactionCommandNameToUse + "' doesn't exist");
    }

}

module.exports.help = {
    name: "interactionCommandCreate"
};