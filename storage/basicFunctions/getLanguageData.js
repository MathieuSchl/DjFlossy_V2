const language = require("../../language.json")


module.exports.get = (data) => {
    try {
        if (!data.language) return "ERR_LANG_NULL";
        const elementLang = data.language ? language[data.language] : language;
        if (!elementLang) return "ERR_UNKNOWN_LANG `" + data.language + "`";
        const elementCat = data.category ? elementLang[data.category] : elementLang;
        if (!elementCat) return "ERR_UNKNOWN_CAT `" + data.category + "`";
        const elementType = data.type ? elementCat[data.type] : elementCat;
        if (!elementType) return "ERR_UNKNOWN_TYPE `" + data.type + "`";
        const elementTag = data.tag ? elementType[data.tag] : elementType;
        if (!elementTag) return "ERR_UNKNOWN_TAG `" + data.tag + "`";

        //console.log(elementTag);
        if (typeof elementTag === "string") return elementTag;
        else return "ERR_ELEMENT_NOT_STRING"
    } catch (e) {
        return "ERROR_UNKNOWN"
    }
}


module.exports.help = {
    name: "getLanguageData"
};