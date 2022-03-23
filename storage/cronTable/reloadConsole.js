var CronJob = require('cron').CronJob;
const Client = require("../discordToolsBox/client")


async function reloadAllConsole(client) {
    client.dataBase.get("textChannel").selectListOfElements(client, ["console"], async (error, results, fields) => {
        for (const result of results) {

            const channel = await Client.channelFetch(client, result.v_id);
            await client.textChannel["console"].get("reload").reload(client, channel);
        }
    });
}

module.exports.run = async (client) => {

    //modify tour cron here

    const needToRun = true;
    if (needToRun) reloadAllConsole(client);
    const job = new CronJob('00 */10 * * * *', async function () {
        reloadAllConsole(client);
    });

    //Stop


    return {
        "needToRun": needToRun,
        "name": "example",
        "job": job
    };
};


module.exports.help = {
    name: "reloadConsole"
};