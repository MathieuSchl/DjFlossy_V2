const {
    Client,
    Intents
} = require('discord.js');


module.exports.new = (location) => {
    const keys = Object.keys(Intents.FLAGS);
    let intentsList = [];
    for (let index = 0; index < keys.length; index++) {
        const element = keys[index];
        intentsList.push(Intents.FLAGS[element]);
    }

    const client = new Client({
        intents: intentsList
    });
    client.location = location;
    client.timeoutList = [];
    client.immediateList = [];
    client.intervalList = [];
    return client;
};

module.exports.login = login;

async function login(client, callback) {
    return await new Promise((resolve) => {
        const tocken = client.config.token;
        client.login(tocken).then(() => {
            if (callback) callback();
            resolve(true)
        }).catch((err) => {
            if (callback) callback(err);
            if (err.path === "/gateway/bot" && err.name === "FetchError" && err.code === 500 && err.method === "get") {
                setTimeout(() => {
                    return login(client, callback);
                }, 10000)
            }
            console.log(err);
            resolve(false);
        })
    })
}

module.exports.destroy = (client) => {
    client.destroy();
}

module.exports.channelFetch = async (client, channelId, callback) => {
    return await new Promise((resolve) => {
        client.channels.fetch(channelId).then((channel) => {
            if (callback) callback(channel);
            resolve(channel);
        }).catch((err) => {
            if (err.code === 10003) resolve(null);
            else {
                console.log(err);
                resolve(false);
            }
        })
    })
}

module.exports.fetchUsers = async (client, data, callback) => {
    return await new Promise((resolve) => {
        client.users.fetch(data).then((user) => {
            if (callback) callback(user);
            resolve(user);
        }).catch((err) => {
            if (err.code === 10013) resolve(null);
            else {
                console.log(err);
                resolve(false);
            }
        })
    })
}

module.exports.guildsFetch = async (client, data) => {
    return await new Promise((resolve) => {
        client.guilds.fetch(data).then((channel) => {
            resolve(channel);
        }).catch((err) => {
            if (err.code === 50001) resolve(null);
            else {
                console.log(err);
                resolve(false);
            }
        })
    })
}





//client events
module.exports.eventReady = (client) => {
    client.on("ready", async () => {
        try {
            client.events.get("ready").run(client);
        } catch (e) {
            console.log("Error in the ready event\n---------\n");
            console.log(e);
            console.log("\n\n")
        }
    });
}

module.exports.guildCreate = (client) => {
    client.on("guildCreate", async (guild) => {
        try {
            client.events.get("guildCreate").run(client, guild);
        } catch (e) {
            console.log("Error in the guildCreate event\n---------\n");
            console.log(e);
            console.log("\n\n")
        }
    });
}

module.exports.guildDelete = (client) => {
    client.on("guildDelete", async (guild) => {
        try {
            client.events.get("guildDelete").run(client, guild);
        } catch (e) {
            console.log("Error in the guildDelete event\n---------\n");
            console.log(e);
            console.log("\n\n")
        }
    });
}

module.exports.guildMemberAdd = (client) => {
    client.on("guildMemberAdd", async (guildMember) => {
        try {
            client.events.get("guildMemberAdd").run(client, guildMember);
        } catch (e) {
            console.log("Error in the guildMemberAdd event\n---------\n");
            console.log(e);
            console.log("\n\n")
        }
    });
}

module.exports.guildMemberRemove = (client) => {
    client.on("guildMemberRemove", async (guildMember) => {
        try {
            client.events.get("guildMemberRemove").run(client, guildMember);
        } catch (e) {
            console.log("Error in the guildMemberRemove event\n---------\n");
            console.log(e);
            console.log("\n\n")
        }
    });
}

module.exports.channelDelete = (client) => {
    client.on("channelDelete", async (channel) => {
        try {
            client.events.get("channelDelete").run(client, channel);
        } catch (e) {
            console.log("Error in the channelDelete event\n---------\n");
            console.log(e);
            console.log("\n\n")
        }
    });
}

module.exports.eventMessageCreate = (client) => {
    client.on("messageCreate", async (message) => {
        try {
            client.events.get("messageCreate").run(client, message);
        } catch (e) {
            console.log("Error in the messageCreate event\n---------\n");
            console.log(e);
            console.log("\n\n")
        }
    });
}

module.exports.eventMessageDelete = (client) => {
    client.on("messageDelete", async (message) => {
        try {
            client.events.get("messageDelete").run(client, message);
        } catch (e) {
            console.log("Error in the messageDelete event\n---------\n");
            console.log(e);
            console.log("\n\n")
        }
    });
}

module.exports.eventMessageReactionAdd = (client) => {
    client.on("messageReactionAdd", async (messageReaction, user) => {
        try {
            client.events.get("messageReactionAdd").run(client, messageReaction, user);
        } catch (e) {
            console.log("Error in the messageReactionAdd event\n---------\n");
            console.log(e);
            console.log("\n\n")
        }
    });
}

module.exports.eventMessageReactionRemove = (client) => {
    client.on("messageReactionRemove", async (messageReaction, user) => {
        try {
            client.events.get("messageReactionRemove").run(client, messageReaction, user);
        } catch (e) {
            console.log("Error in the messageReactionRemove event\n---------\n");
            console.log(e);
            console.log("\n\n")
        }
    });
}

module.exports.interactionCreate = (client) => {
    client.on("interactionCreate", async (interaction) => {
        try {
            if (interaction.isButton()) {
                client.events.get("interactionButtonCreate").run(client, interaction);
            } else if (interaction.isSelectMenu()) {
                client.events.get("interactionSelectMenuCreate").run(client, interaction);
            } else if (interaction.isCommand()) {
                client.events.get("interactionCommandCreate").run(client, interaction);
            }
        } catch (e) {
            console.log("Error in the interactionCreate event\n---------\n");
            console.log(e);
            console.log("\n\n")
        }
    });
}

module.exports.inviteCreate = (client) => {
    client.on("inviteCreate", async (invite) => {
        try {
            client.events.get("inviteCreate").run(client, invite);
        } catch (e) {
            console.log("Error in the inviteCreate event\n---------\n");
            console.log(e);
            console.log("\n\n")
        }
    });
}

module.exports.inviteDelete = (client) => {
    client.on("inviteDelete", async (invite) => {
        try {
            client.events.get("inviteDelete").run(client, invite);
        } catch (e) {
            console.log("Error in the inviteDelete event\n---------\n");
            console.log(e);
            console.log("\n\n")
        }
    });
}

module.exports.voiceStateUpdate = (client) => {
    client.on("voiceStateUpdate", async (oldState, newState) => {
        try {
            client.events.get("voiceStateUpdate").run(client, oldState, newState);
        } catch (e) {
            console.log("Error in the voiceStateUpdate event\n---------\n");
            console.log(e);
            console.log("\n\n")
        }
    });
}


module.exports.help = {
    name: "client"
};