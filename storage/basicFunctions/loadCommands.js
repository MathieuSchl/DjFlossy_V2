const GuildCommands = require("../discordToolsBox/guildCommand");
const Commands = require("../discordToolsBox/command");


module.exports.loadCommands = async (client) => {
    const language = client.config.defaultGuildLanguage ? client.config.defaultGuildLanguage : "en";

    //Delete all previous commands
    const commandsList = Array.from(await Commands.fetch(client))
    for (let index = 0; index < commandsList.length; index++) {
        const command = commandsList[index][1];
        await Commands.delete(command);
    }

    //Add all new command
    const newCommandsList = Object.keys(client.command);
    for (let index = 0; index < newCommandsList.length; index++) {
        const commandTag = newCommandsList[index];
        const commandData = client.command[commandTag].get("index").getCommandData(client, {
            language: language
        });
        const permissions = client.command[commandTag].get("index").getPermissions(client, {
            clientCommand: true
        });
        if (commandData && permissions !== false) Commands.create(client, commandData);
    }
};

module.exports.testCommands = async (guild) => {
    const client = guild.client;

    const language = await new Promise((resolve) => {
        client.dataBase.get("guild").select(client, guild.id, (error, results, fields) => {
            if (error) throw error;

            resolve(results[0].v_language)
        });
    })

    //Delete all previous commands
    const commandsList = Array.from(await GuildCommands.fetch(guild))
    for (let index = 0; index < commandsList.length; index++) {
        const command = commandsList[index][1];
        await GuildCommands.delete(command);
    }

    //Add all new command
    const newCommandsList = Object.keys(client.command);
    for (let index = 0; index < newCommandsList.length; index++) {
        const commandTag = newCommandsList[index];
        const commandData = await client.command[commandTag].get("index").getCommandData(client, {
            guild: guild,
            language: language
        });
        const permissions = client.command[commandTag].get("index").getPermissions(client, {
            guild: guild
        });
        if (commandData) {
            GuildCommands.create(guild, commandData, permissions);
        }
    }
};

module.exports.help = {
    name: "loadCommands"
};