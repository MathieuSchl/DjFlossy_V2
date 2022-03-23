const Channel = require("../discordToolsBox/channel");


module.exports.run = (client, channel) => {
    if (channel.type === "GUILD_CATEGORY") {
        client.dataBase.get("category").delete(client, channel.id, async (error, results, fields) => {
            if (error) {
                console.log(error);
            }
        });
    } else {
        if (channel.type === "GUILD_TEXT") {
            client.dataBase.get("textChannel").delete(client, channel.id, async (error, results, fields) => {
                if (error) {
                    console.log(error);
                }
            });
        }

        //if parent in db and parents have no child, delete category (if t_deleteifempty is true)
        if (channel.parent && channel.parent.children.size === 0) {
            client.dataBase.get("category").select(client, channel.parent.id, async (error, results, fields) => {
                if (error) console.log(error);
                else {
                    const result = results[0];
                    if (result && result.t_deleteifempty === 1) {
                        Channel.deleteChannel(channel.parent);
                    }
                }
            });
        }
    }
}


module.exports.help = {
    name: "channelDelete"
};