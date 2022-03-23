const getLanguageDataFunc = require("../../basicFunctions/getLanguageData");
const MessageActionRow = require("../../discordToolsBox/messageActionRow");
const MessageSelectMenu = require("../../discordToolsBox/messageSelectMenu");


function getLanguageData(language, tag) {
  return getLanguageDataFunc.get({
    language: language,
    category: "textChannel",
    type: "musicPannel",
    tag: tag
  })
}

module.exports.musicPannel = {
  message: (lg) => {
    return {
      "content": null,
      "embeds": [{
        title: getLanguageData(lg, "COMMANDS_TITLE"),
        description: getLanguageData(lg, "COMMANDS_DESC"),
        color: "#FF9600"
      }]
    }
  },
  actionRow: async (lg, params) => {
    const client = params.client
    return new Promise((res) => {
      client.dataBase.get("playlist").selectAllEnable(client, async (error, playlistData) => {
        if (error) throw error;

        const options = [];
        for (let index = 0; index < playlistData.length; index++) {
          const element = playlistData[index];
          options.push({
            "label": (element.v_data[lg] && element.v_data[lg].label) ? element.v_data[lg].label : (element.v_data["en"] && element.v_data["en"].label) ? element.v_data["en"].label : "ERROR_UNKNOWN_LABEL_TEXT",
            "value": element.i_id + "",
            "description": (element.v_data[lg] && element.v_data[lg].desc) ? element.v_data[lg].desc : (element.v_data["en"] && element.v_data["en"].desc) ? element.v_data["en"].desc : "ERROR_UNKNOWN_LABEL_TEXT",
            "emoji": element.v_emoji
          })
        }
        const row = MessageActionRow.new();
        const playlistSelectMenu = MessageSelectMenu.new({
          "customId": "selectPlaylist",
          "options": options
        });
        MessageActionRow.addComponents(row, playlistSelectMenu);
        return res([row]);
      });
    })
  }
}



module.exports.help = {
  name: "getMessage"
}