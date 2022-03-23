const {
    MessageActionRow,
} = require("discord.js");


module.exports.new = () => {
    return new MessageActionRow();
}

module.exports.addComponents = (actionRow,components) => {
    actionRow.addComponents(components);
    return;
}



module.exports.help = {
    name: "messageActionRow"
};