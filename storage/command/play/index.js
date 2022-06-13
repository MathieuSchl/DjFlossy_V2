const Interaction = require("../../discordToolsBox/interaction");
const Guild = require("../../discordToolsBox/guild");
const getLanguageDataFunc = require("../../basicFunctions/getLanguageData");
const {
    RepeatMode
} = require('discord-music-player');


function makeid(length) {
    var result = '';
    var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for (var i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() *
            charactersLength));
    }
    return result;
}

const optionToTrad = ["OPTION_NAME_SHUFFLE"];
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
            const optionTrad = languageData[element]["command"]["play"][optionName];
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
        type: "play",
        tag: tag
    })
}

function shuffle(a) {
    var j, x, i;
    for (i = a.length - 1; i > 0; i--) {
        j = Math.floor(Math.random() * (i + 1));
        x = a[i];
        a[i] = a[j];
        a[j] = x;
    }
    return a;
}

async function startSong(client, interaction, playList, repeatMode, user, replyLanguage) {
    let queue = client.player.getQueue(interaction.guild.id) == null ? client.player.createQueue(interaction.guild.id) : client.player.getQueue(interaction.guild.id);
    await queue.setRepeatMode(RepeatMode.DISABLED);
    if (queue.connection == null) await queue.join(interaction.member.voice.channel);
    for (let index = 0; index < playList.length && index < 50; index++) {
        const element = playList[index];
        if (!queue.destroyed) await queue.play(element, {
            requestedBy: user
        }).catch((err) => {
            console.log(err);
            console.log(element);
        })
        if (index === 0) {
            if (playList.length === 1) {
                Interaction.editReply(interaction, {
                    content: getLanguageData(replyLanguage, "MUSIC_ADD"),
                    ephemeral: true
                });
            } else {
                Interaction.editReply(interaction, {
                    content: getLanguageData(replyLanguage, "CUSTOM_PLAYLIST_YT_PLAYED"),
                    ephemeral: true
                });
            }
        }
    }
    if (repeatMode && !queue.destroyed) await queue.setRepeatMode(repeatMode);
    return;
    await client.basicFunctions.get("startMusic").addAllSongsFromList(queue, playList, user, async () => {
        // Code qui est exécuté après le changement de token (création de playlist)
        if (queue.songs.length != 0 && queue.songs[0].requestedBy.id === client.user.id) await queue.clearQueue();
        return;
    }, async () => {
        // Code qui est exécuté après que la première musique de la playlist ait été ajoutée
        if (queue.songs.length != 0 && queue.songs[0].requestedBy.id === client.user.id) await queue.skip(1);
        if (repeatMode) await queue.setRepeatMode(repeatMode);
        Interaction.editReply(interaction, {
            content: getLanguageData(replyLanguage, "CUSTOM_PLAYLIST_YT_PLAYED"),
            ephemeral: true
        });
        return;
    });
}

module.exports.startPlaylist = startPlaylist
async function startPlaylist(client, interaction, playlistTocken, needToShuffle, repeatMode, user, replyLanguage) {
    client.basicFunctions.get("getVideosFromYtPlaylist").run(playlistTocken, async (res) => {
        if (!res) {
            Interaction.editReply(interaction, {
                content: getLanguageData(replyLanguage, "INVALID_URL"),
                ephemeral: true
            });
            return;
        }
        if (needToShuffle) res = shuffle(res);

        startSong(client, interaction, res, repeatMode, user, replyLanguage);
    });
}


module.exports.run = async (client, interaction, user, userData, guild, guildData) => {
    const guildLanguage = guildData.v_language;
    const replyLanguage = guildLanguage ? guildLanguage : client.config.defaultUserLanguage ? client.config.defaultUserLanguage : "en";

    const url = interaction.options.get("value").value;
    const repeatMode = interaction.options.get("loop") ? RepeatMode[interaction.options.get("loop").value] : null;
    const optionShuffle = getValueFromOption(interaction.options["_hoistedOptions"], "OPTION_NAME_SHUFFLE", guildLanguage);
    const needToShuffle = optionShuffle === null ? true : optionShuffle;
    if (!url) return;


    const member = await Guild.fetchMembers(interaction.guild, user.id);
    if (!member.voice.channelId) {
        Interaction.reply(interaction, {
            content: getLanguageData(replyLanguage, "USER_NOT_IN_VOICE_CHANNEL"),
            ephemeral: true
        });
        return;
    }
    await Interaction.deferReply(interaction, {
        ephemeral: true
    })

    if (url.startsWith('https://www.youtube.com/watch?v=')) {
        const query = url.split("watch?v=")[1];
        const videoTocken = query.split("&")[0];
        startSong(client, interaction, [videoTocken], repeatMode, user, replyLanguage);
    } else if (url.startsWith('https://youtu.be/')) {
        const query = url.split("https://youtu.be/")[1];
        const videoTocken = query.split("?")[0];
        startSong(client, interaction, [videoTocken], repeatMode, user, replyLanguage);
    } else if (url.startsWith('https://www.youtube.com/playlist?list=') || url.startsWith('https://youtube.com/playlist?list=')) {
        const playlistTocken = url.split("playlist?list=")[1];
        startPlaylist(client, interaction, playlistTocken, needToShuffle, repeatMode, user, replyLanguage);
    } else if (url.startsWith('https') || url.startsWith('http')) {
        Interaction.reply(interaction, {
            content: getLanguageData(replyLanguage, "UNRECONIZED_URL_FORMAT"),
            ephemeral: true
        });
    } else {
        let queue = client.player.getQueue(interaction.guild.id) == null ? client.player.createQueue(interaction.guild.id) : client.player.getQueue(interaction.guild.id);
        await queue.setRepeatMode(RepeatMode.DISABLED);
        if (queue.data == null) queue.data = {};
        if (queue.connection == null) await queue.join(interaction.member.voice.channel);
        await queue.play(url, {
            requestedBy: user
        }).then(async () => {
            if (queue.songs.length != 0 && queue.songs[0].requestedBy.id === client.user.id) await queue.skip(1);
            Interaction.editReply(interaction, {
                content: getLanguageData(replyLanguage, "MUSIC_ADD"),
                ephemeral: true
            });
            setTimeout(async () => {
                if (repeatMode) await queue.setRepeatMode(repeatMode);
            }, 2500);
        }).catch((err) => {
            console.log(err);
            console.log(url);
        })
    }
}


module.exports.help = {
    name: "index"
}

module.exports.getCommandData = (client, data) => {
    let language = data.language;
    language = language ? language : client.config.defaultGuildLanguage ? client.config.defaultGuildLanguage : "en";
    return {
        name: getLanguageData(language, "NAME"),
        description: getLanguageData(language, "DESCRIPTION"),
        options: [{
            type: "STRING",
            name: "value",
            description: getLanguageData(language, "DESCRIPTION_OPTION_URL"),
            required: true
        }, {
            type: "STRING",
            name: getLanguageData(language, "OPTION_NAME_REPEAT_MODE"),
            description: getLanguageData(language, "OPTION_DESCRIPTION_REPEAT_MODE"),
            choices: [{
                name: getLanguageData(language, "OPTION_REPEAT_MODE_OPTION_DISABLED"),
                value: "DISABLED"
            }, {
                name: getLanguageData(language, "OPTION_REPEAT_MODE_OPTION_SONG"),
                value: "SONG"
            }, {
                name: getLanguageData(language, "OPTION_REPEAT_MODE_OPTION_QUEUE"),
                value: "QUEUE"
            }]
        }, {
            type: "BOOLEAN",
            name: getLanguageData(language, "OPTION_NAME_SHUFFLE"),
            description: getLanguageData(language, "OPTION_DESCRIPTION_SHUFFLE")
        }]
    }
}

module.exports.getPermissions = (client, data) => {
    if (data.clientCommand) return false;
    return [];
}