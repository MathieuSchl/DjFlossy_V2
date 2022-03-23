module.exports.run = (client, message) => {
    const user = message.author;
    if (user.id !== client.user.id) return;

    client.dataBase.get("message").delete(client, message.id, (error) => {
        if (error) console.log(error);
    })
}


module.exports.help = {
    name: "messageDelete"
};