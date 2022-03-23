const getLanguageDataFunc = require("../../basicFunctions/getLanguageData");


function getLanguageData(language, tag) {
  return getLanguageDataFunc.get({
    language: language,
    category: "selectMenu",
    type: "selectLang",
    tag: tag
  })
}

function replaceAll(str, find, replace) {
  return str.replace(new RegExp(find, 'g'), replace);
}


module.exports.languageReply = {
  message: (lg, data) => {
    return {
      "content": null,
      "embeds": [{
        "title": getLanguageData(lg, "REPLY_TITLE"),
        "description": replaceAll(getLanguageData(lg, "REPLY_DESCRIPTION"), "<#>", data.guildName),
        "color": 0x939393
      }]
    }
  }
}



module.exports.help = {
  name: "getMessage"
}