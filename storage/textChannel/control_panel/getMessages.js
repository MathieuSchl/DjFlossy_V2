const getLanguageDataFunc = require("../../basicFunctions/getLanguageData");
const MessageActionRow = require("../../discordToolsBox/messageActionRow");
const MessageButton = require("../../discordToolsBox/messageButton");


function getLanguageData(language, tag) {
  return getLanguageDataFunc.get({
    language: language,
    category: "textChannel",
    type: "control_panel",
    tag: tag
  })
}


module.exports.commandPannel = {
  message: (lg) => {
    return {
      "content": null,
      "embeds": [{
        title: getLanguageData(lg, "COMMANDS_LIST"),
        description: getLanguageData(lg, "COMMANDS_DESC"),
        color: "#FF9600"
      }]
    }
  },
  actionRow: (lg) => {
    const row = MessageActionRow.new();
    const pingButton = MessageButton.new({
      "label": "Ping",
      "customId": "ping",
      "style": "SUCCESS",
      "emoji": "👋"
    });
    const destroyButton = MessageButton.new({
      "label": getLanguageData(lg, "BUTTON_DESTROY_TEXT"),
      "customId": "destroy",
      "style": "DANGER",
      "emoji": "💣"
    });
    MessageActionRow.addComponents(row, pingButton);
    MessageActionRow.addComponents(row, destroyButton);
    return [row];
  }
}



module.exports.help = {
  name: "getMessage"
}