module.exports.run = async (client) => {
    console.log(" ");
    console.log("Logged in as : " + client.user.tag);
    console.log(" ");

    await client.basicFunctions.get("deleteSomeTypeOfElement").run(client);
    await client.basicFunctions.get("fetchElementsForDb").run(client);
    await client.basicFunctions.get("cronTab").run(client);
    client.basicFunctions.get("activity").run(client);

    client.basicFunctions.get("startGuildPlayer").allGuilds(client);
}

module.exports.help = {
    name: "ready"
};