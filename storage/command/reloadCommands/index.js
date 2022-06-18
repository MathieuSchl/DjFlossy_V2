const Client = require("../../discordToolsBox/client");
const GuildCommands = require("../../discordToolsBox/guildCommand");
const Interaction = require("../../discordToolsBox/interaction");
const config = require("../../../config.json");
const getLanguageDataFunc = require("../../basicFunctions/getLanguageData");


function getLanguageData(language, tag) {
    return getLanguageDataFunc.get({
        language: language,
        category: "command",
        type: "reloadCommands",
        tag: tag
    })
}

function getNameOfPlaylistCommand(language, tag) {
    return getLanguageDataFunc.get({
        language: language,
        category: "command",
        type: "playPlaylist",
        tag: tag
    })
}


module.exports.reloadPlaylists = reloadPlaylists;
async function reloadPlaylists(client) {
    const guildsCollection = await Client.guildsFetch(client);
    const guilds = Array.from(guildsCollection);
    for (let index = 0; index < guilds.length; index++) {
        const element = guilds[index][1];
        const guild = await Client.guildsFetch(client, element.id);
        const guildData = await new Promise((resolve) => {
            client.dataBase.get("guild").select(client, guild.id, (error, results, fields) => {
                if (error) throw error;

                resolve(results[0])
            });
        })
        const commandName = getNameOfPlaylistCommand(guildData.v_language, "NAME");

        const commands = Array.from(await GuildCommands.fetch(guild));
        for (let index = 0; index < commands.length; index++) {
            const command = commands[index][1];
            if (command.name == commandName) {
                await GuildCommands.delete(command);

                break;
            }
        }
        const commandTag = "playPlaylist";
        const commandData = await client.command[commandTag].get("index").getCommandData(client, {
            guild: guild,
            language: guildData.v_language
        });
        const permissions = client.command[commandTag].get("index").getPermissions(client, {
            guild: guild
        });
        if (commandData) {
            await GuildCommands.create(guild, commandData, permissions);
        }
    }
}

module.exports.run = async (client, interaction, user, userData, guild, guildData) => {
    const commandLanguage = guildData.v_language ? guildData.v_language : "en";
    const musicCommand = interaction.options.get(getLanguageData(commandLanguage, "OPTION_NAME_MUSIC_CMD")) ? interaction.options.get(getLanguageData(commandLanguage, "OPTION_NAME_MUSIC_CMD")).value : true;
    if (musicCommand) {
        Interaction.reply(interaction, {
            content: getLanguageData(commandLanguage, "PLAYLIST_COMMAND_RELOAD"),
            ephemeral: true
        });
        await reloadPlaylists(client);
    } else {
        Interaction.reply(interaction, {
            content: getLanguageData(commandLanguage, "COMMANDS_RELOAD"),
            ephemeral: true
        });
        const guildsCollection = await Client.guildsFetch(client);
        const guilds = Array.from(guildsCollection);
        for (let index = 0; index < guilds.length; index++) {
            const element = guilds[index][1];
            const guild = await Client.guildsFetch(client, element.id);
            client.basicFunctions.get("loadCommands").testCommands(guild);
            await client.basicFunctions.get("wait").run(100);
        }
    }
}


module.exports.help = {
    name: "index"
}

module.exports.getCommandData = async (client, data) => {
    const guild = data.guild;
    let language = data.language;
    language = language ? language : client.config.defaultGuildLanguage ? client.config.defaultGuildLanguage : "en";
    if (!guild || !config.guildAdmin.includes(guild.id)) return null;

    return {
        name: getLanguageData(language, "NAME"),
        description: getLanguageData(language, "DESCRIPTION"),
        options: [{
            type: "BOOLEAN",
            name: getLanguageData(language, "OPTION_NAME_MUSIC_CMD"),
            description: getLanguageData(language, "OPTION_DESCRIPTION_MUSIC_CMD")
        }]
    }
}

module.exports.getPermissions = (client, data) => {
    if (data.clientCommand) return false;

    return []
}