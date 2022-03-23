const Discord = require("discord.js");


module.exports.run = async (client) => {
    let listCron = Array.from(client.cronTable);
    if (listCron.length !== 0) client["cronTab"] = new Discord.Collection();

    for (let cron of listCron) {
        const {
            needToRun,
            name,
            job
        } = await cron[1].run(client);
        if (needToRun) {
            job.start();
            client.cronTab.set(name, job);
        }
    }
};

module.exports.stop = async (client) => {
    try {
        let listCron = Array.from(client.cronTable);

        for (let cron of listCron) {
            client.cronTab.get(cron[0]).stop();
        }
    } catch {}
};


module.exports.help = {
    name: "cronTab"
};