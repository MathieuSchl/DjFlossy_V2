const {
    MessageButton
} = require("discord.js");


module.exports.new = (data) => {
    return new MessageButton(data);
}


module.exports.setCustomId = (button,customId) => {
    button.setCustomId(customId);
    return;
}

module.exports.setDisabled = (button, disabled) => {
    button.setDisabled(disabled);
    return;
}

module.exports.setEmoji = (button, emoji) => {
    button.setEmoji(emoji);
    return;
}

module.exports.setLabel = (button, label) => {
    button.setLabel(label);
    return;
}

module.exports.setStyle = (button, style) => {
    button.setStyle(style);
    return;
}

module.exports.setURL = (button, url) => {
    button.setURL(url);
    return;
}



module.exports.help = {
    name: "messageButton"
};