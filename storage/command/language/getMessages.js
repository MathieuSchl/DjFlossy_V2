const getLanguageDataFunc = require("../../basicFunctions/getLanguageData");
const languages = Object.keys(require("../../../language.json"));
const MessageActionRow = require("../../discordToolsBox/messageActionRow");
const MessageSelectMenu = require("../../discordToolsBox/messageSelectMenu");


function getLanguageData(language, tag) {
  return getLanguageDataFunc.get({
    language: language,
    category: "command",
    type: "language",
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

function shuffle(a) {
  var j, x, i;
  for (i = a.length - 1; i > 0; i--) {
    j = Math.floor(Math.random() * (i + 1));
    x = a[i];
    a[i] = a[j];
    a[j] = x;
  }
  return a;
}

function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

function getLine(language) {
  return getBasicDataLang(language, "FLAG") + " " + getLanguageData(language, "PLEASE_SELECT_LANGUAGE");
}

module.exports.languageMessage = {
  message: (lg) => {
    const randomLanguages = shuffle(languages);

    const description = getLine(randomLanguages[0]) + "\n" +
      getLine(randomLanguages[1]) + "\n" +
      getLine(randomLanguages[2]) + "\n";

    return {
      "content": null,
      "embeds": [{
        "title": getLine("en"),
        "description": description,
        "color": 14947348
      }]
    }
  },
  actionRow: (lg) => {
    const row = MessageActionRow.new();
    const options = [];

    for (let index = 0; index < languages.length; index++) {
      const lang = languages[index];
      options.push({
        label: capitalizeFirstLetter(getBasicDataLang(lang, "NAME")),
        value: lang,
        description: getLanguageData(lang, "DESC_OPTION_SELECT_LANG"),
        emoji: getBasicDataLang(lang, "FLAG"),
        default: lang === lg
      })
    }

    const menuSelectorData = {
      customId: "selectLang",
      placeholder: "Choose a language",
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