module.exports.removeAUser = (messageReaction, userId) => {
    messageReaction.users.remove(userId);
}


module.exports.help = {
    name: "messageReaction"
};