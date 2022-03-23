//prepare client object
const client = require("./storage/discordToolsBox/client").new(__dirname + "/");
require("./storage/basicFunctions/startupFunction").checkConfig(client);
require("./storage/basicFunctions/startupFunction").loadFunctions(client);

const {
    Player
} = require("discord-music-player");
const player = new Player(client, {
    leaveOnEnd: false,
    leaveOnStop: false,
    leaveOnEmpty: false,
});
client.player = player;
player.on('error', (error, queue) => {
    console.log(`Error: ${error} in ${queue.guild.name}`);
});

//start all events
client.discordToolsBox.get("client").eventReady(client);

client.discordToolsBox.get("client").guildCreate(client);
client.discordToolsBox.get("client").guildDelete(client);
client.discordToolsBox.get("client").guildMemberAdd(client);
client.discordToolsBox.get("client").guildMemberRemove(client);

client.discordToolsBox.get("client").channelDelete(client);

client.discordToolsBox.get("client").eventMessageCreate(client);
client.discordToolsBox.get("client").eventMessageDelete(client);
client.discordToolsBox.get("client").eventMessageReactionAdd(client);
client.discordToolsBox.get("client").eventMessageReactionRemove(client);

client.discordToolsBox.get("client").interactionCreate(client);

client.discordToolsBox.get("client").inviteCreate(client);
client.discordToolsBox.get("client").inviteDelete(client);

client.discordToolsBox.get("client").voiceStateUpdate(client);



//connect the bot
client.dataBase.get("connection").createConnection(client, () => {
    client.discordToolsBox.get("client").login(client);
})