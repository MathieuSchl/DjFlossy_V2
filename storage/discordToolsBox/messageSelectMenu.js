const {
    MessageSelectMenu
} = require("discord.js");


module.exports.new = (data) => {
    return new MessageSelectMenu(data);
}


module.exports.addOptions = (selectMenu, options) => {
    selectMenu.addOptions(options);
    return;
}

module.exports.setCustomId = (selectMenu, customId) => {
    selectMenu.setCustomId(customId);
    return;
}

module.exports.setDisabled = (selectMenu, disabled) => {
    selectMenu.setDisabled(disabled);
    return;
}

module.exports.setMaxValues = (selectMenu, maxValues) => {
    selectMenu.setMaxValues(maxValues);
    return;
}

module.exports.setMinValues = (selectMenu, minValues) => {
    selectMenu.setMinValues(minValues);
    return;
}

module.exports.setPlaceholder = (selectMenu, placeholder) => {
    selectMenu.setPlaceholder(placeholder);
    return;
}



module.exports.help = {
    name: "messageSelectMenu"
};