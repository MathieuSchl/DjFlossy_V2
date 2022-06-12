const getLanguageDataFunc = require("../../basicFunctions/getLanguageData");
const languages = Object.keys(require("../../../language.json"));
const MessageActionRow = require("../../discordToolsBox/messageActionRow");
const MessageSelectMenu = require("../../discordToolsBox/messageSelectMenu");


function getLanguageData(language, tag) {
  return getLanguageDataFunc.get({
    language: language,
    category: "command",
    type: "playPrivatePlaylist",
    tag: tag
  })
}

function getBasicDataLang(language, tag) {
  return getLanguageDataFunc.get({
    language: language,
    category: null,
    type: null,
    tag: tag
  })
}

module.exports.languageMessage = {
  message: (lg, playlists) => {
    if (playlists == null || playlists.length === 0) return {
      "content": getLanguageData(lg, "NO_PLAYLIST_REGISTERED")
    }
    return {
      "content": getLanguageData(lg, "SELECT_YOUR_PLAYLIST")
    }
  },
  actionRow: (lg, playlists) => {
    if (playlists == null || playlists.length === 0) return null;
    const row = MessageActionRow.new();
    const options = [];

    for (let index = 0; index < playlists.length; index++) {
      const playlist = playlists[index];
      options.push({
        label: playlist.name,
        value: playlist.tag
      })
    }

    const menuSelectorData = {
      customId: "selectPrivatePlaylist",
      placeholder: getLanguageData(lg, "PLACEHOLDER"),
      options: options
    };

    const selectMenu = MessageSelectMenu.new(menuSelectorData);

    MessageActionRow.addComponents(row, selectMenu);
    return [row];
  }
}



module.exports.help = {
  name: "getMessage"
}