const Channel = require("../discordToolsBox/channel");
const Message = require("../discordToolsBox/message");
const getLanguageDataFunc = require("./getLanguageData");


function getLanguageData(language, tag) {
    return getLanguageDataFunc.get({
        language: language,
        category: "basicFunctions",
        type: "stopProgram",
        tag: tag
    })
}

module.exports.stop = async (client, channel) => {
    const language = client.config.defaultGuildLanguage ? client.config.defaultGuildLanguage : "en";
    client.discordToolsBox.get("clientUser").setActivity(client, {
        name: getLanguageData(language, "SHUTTING_DOWN"),
        type: 'WATCHING'
    });
    if (channel != null) {
        await new Promise((resolve) => {
            client.dataBase.get("textChannel").select(client, channel.id, (error, results, fields) => {
                if (error) throw error;

                const result = results[0];
                const channelLanguage = result.v_language ? result.v_language : "en";
                Channel.send(channel, getLanguageData(channelLanguage, "SHUTTING_DOWN"), (msg) => {
                    const timeoutObj = setTimeout(async () => {
                        await Message.delete(msg);
                        resolve();
                    }, 3000);
                    client.timeoutList.push(timeoutObj);
                })
            });
        })
    }
    for (let index = 0; index < client.timeoutList.length; index++) {
        const element = client.timeoutList[index];
        clearTimeout(element);
    }

    for (let index = 0; index < client.immediateList.length; index++) {
        const element = client.immediateList[index];
        clearImmediate(element);
    }

    for (let index = 0; index < client.intervalList.length; index++) {
        const element = client.intervalList[index];
        clearInterval(element);
    }
    await client.basicFunctions.get("cronTab").stop(client);

    setTimeout(async () => {
        const clientUserTag = client.user.tag;
        client.dataBase.get("connection").close(client.db);
        client.discordToolsBox.get("client").destroy(client);
        console.log(" ");
        console.log("Logged out as : " + clientUserTag);
        console.log(" ");
        process.exit(0);
    }, 250);
};

module.exports.help = {
    name: "stopProgram"
};