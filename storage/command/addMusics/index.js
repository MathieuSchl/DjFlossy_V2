const Interaction = require("../../discordToolsBox/interaction");
const Guild = require("../../discordToolsBox/guild");
const Channel = require("../../discordToolsBox/channel");
const Message = require("../../discordToolsBox/message");
const config = require("../../../config.json");
const getLanguageDataFunc = require("../../basicFunctions/getLanguageData");

const optionToTrad = ["OPTION_NAME_PLAYLIST"];
const getOptionsNames = () => {
    const languageData = require("../../../language.json");
    const language = Object.keys(languageData);
    const res = {};
    for (let index = 0; index < language.length; index++) {
        const element = language[index];
        res[element] = {};
        res[element]["command"] = {};
        for (let index = 0; index < optionToTrad.length; index++) {
            const optionName = optionToTrad[index];
            if (!res[element]["command"][optionName]) res[element]["command"][optionName] = [];
            const optionTrad = languageData[element]["command"]["addMusics"][optionName];
            res[element]["command"][optionName].push(optionTrad);
        }
    }
    return res;
}
const optionsNames = getOptionsNames();

function getValueFromOption(options, tag, lg) {
    for (const option of options) {
        if (optionsNames[lg]["command"][tag].includes(option.name)) {
            return option.value;
        }
    }
    return null;
}

function getLanguageData(language, tag) {
    return getLanguageDataFunc.get({
        language: language,
        category: "command",
        type: "addMusics",
        tag: tag
    })
}


module.exports.run = async (client, interaction, user, userData, guild, guildData) => {
    const guildLanguage = guildData.v_language;
    const memberLanguage = userData.v_language;
    const replyLanguage = guildLanguage ? guildLanguage : client.config.defaultUserLanguage ? client.config.defaultUserLanguage : "en";

    const url = interaction.options.get("url").value;
    const valuePlaylist = getValueFromOption(interaction.options["_hoistedOptions"], "OPTION_NAME_PLAYLIST", guildLanguage);
    if (!url) return;

    client.basicFunctions.get("getVideosFromYtPlaylist").run(url, async (res) => {
        if (!res) {
            Interaction.reply(interaction, {
                content: getLanguageData(replyLanguage, "INVALID_URL"),
                ephemeral: true
            });
            return;
        }
        const dbPrefix = await client.dataBase.get("dbConfiguration").getDbPrefix(client);
        for (const music of res) {
            try {
                const id = await new Promise((res) => {
                    client.dataBase.get("connection").exec(client.db, 'INSERT INTO ?? (`v_tagName`) VALUES (?)', [dbPrefix + "musicslist", music], async (error, results, fields) => {
                        if (error && error.code === "ER_DUP_ENTRY") {
                            client.dataBase.get("connection").exec(client.db, 'SELECT i_id AS id FROM ?? WHERE v_tagName = ?', [dbPrefix + "musicslist", music], async (error, results, fields) => {
                                if (error) throw error;
                                else if (results.length === 0) res(null);
                                else res(results[0].id);
                            })
                        } else if (error) throw error;
                        client.dataBase.get("connection").exec(client.db, "SELECT LAST_INSERT_ID() AS 'id'", [], async (error, results, fields) => {
                            if (error) throw error;
                            else res(results[0].id);
                        });
                    });
                })
                if (id) {
                    await new Promise((res) => {
                        client.dataBase.get("connection").exec(client.db, "SELECT 1 FROM ?? WHERE i_idTag = (SELECT i_id AS id FROM ?? WHERE v_name = ?) AND i_idMusic = ?", [dbPrefix + "musicscorrelation", dbPrefix + "musicTag", valuePlaylist, id], async (error, results, fields) => {
                            if (error) throw error;
                            if (results.length !== 0) {
                                res()
                                return;
                            }
                            client.dataBase.get("connection").exec(client.db, "INSERT INTO ?? (`i_idTag`, `i_idMusic`) VALUES ((SELECT i_id AS id FROM ?? WHERE v_name = ?), ?)", [dbPrefix + "musicscorrelation", dbPrefix + "musicTag", valuePlaylist, id], async (error, results, fields) => {
                                if (error) throw error;
                                res();
                            });
                        });
                    })
                }
            } catch (error) {
                console.log(error);
            }
        }
        Interaction.reply(interaction, {
            content: getLanguageData(replyLanguage, "PLAYLIST_ACCEPTED").replace('<§Url§>', '`' + url + '`'),
            ephemeral: true
        });
    });
}


module.exports.help = {
    name: "index"
}

module.exports.getCommandData = async (client, data) => {
    const guild = data.guild;
    let language = data.language;
    language = language ? language : client.config.defaultGuildLanguage ? client.config.defaultGuildLanguage : "en";
    if (!guild || !config.guildAdmin.includes(guild.id)) return null;

    const dbPrefix = await client.dataBase.get("dbConfiguration").getDbPrefix(client);
    return await new Promise((resolve) => {
        client.dataBase.get("connection").exec(client.db, 'SELECT v_name AS name FROM ?? WHERE b_enable = 1', [dbPrefix + "musicTag"], async (error, results, fields) => {
            if (error) throw error;
            const choices = [];
            for (const result of results) {
                choices.push({
                    name: result.name,
                    value: result.name
                });
            }
            resolve({
                name: getLanguageData(language, "NAME"),
                description: getLanguageData(language, "DESCRIPTION"),
                options: [{
                    type: "STRING",
                    name: "url",
                    description: getLanguageData(language, "DESCRIPTION_OPTION_URL"),
                    required: true
                }, {
                    type: "STRING",
                    name: "playlist",
                    description: getLanguageData(language, "DESCRIPTION_OPTION_URL"),
                    required: true,
                    choices: choices
                }]
            })
        });
    })
}

module.exports.getPermissions = (client, data) => {
    if (data.clientCommand) return false;
    let guild = data.guild;

    return [{
        id: guild.ownerId,
        type: 'USER',
        permission: true,
    }, {
        id: guild.roles.everyone.id,
        type: 'ROLE',
        permission: false,
    }]
}