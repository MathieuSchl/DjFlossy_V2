const {
    MessageEmbed
} = require('discord.js');


module.exports.new = (data) => {
    return new MessageEmbed(data);
}

module.exports.setColor = (embed, color) => {
    embed.setColor(color);
    return;
}

module.exports.setTitle = (embed, title) => {
    embed.setTitle(title);
    return;
}

module.exports.setDescription = (embed, description) => {
    embed.setDescription(description);
    return;
}


module.exports.help = {
    name: "embed"
};