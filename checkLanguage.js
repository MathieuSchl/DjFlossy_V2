const languageFile = require("./language.json");
const languages = Object.keys(languageFile);
let OK = true;


function getObject(theObject, exploPath) {
    let res = theObject;
    for (let index = 0; index < exploPath.length; index++) {
        const element = exploPath[index];
        res = res[element];
    }
    return res;
}

function explore(indexLang, exploPath) {
    try {
        const witnessLanguage = languages[indexLang];
        const theWitnessObject = getObject(languageFile[witnessLanguage], exploPath);
        const result = Object.keys(theWitnessObject);

        for (let indexKeys = 0; indexKeys < result.length; indexKeys++) {
            const elementKey = result[indexKeys];
            const targetType = typeof theWitnessObject[elementKey]
            for (let indexLang = 0; indexLang < languages.length; indexLang++) {
                const elementLang = languages[indexLang];
                const theObject = getObject(languageFile[elementLang], exploPath);
                if (theObject == null) {
                    console.log(elementLang + " - " + elementKey + " - undifined");
                    console.log(exploPath);
                    console.log("Value in " + witnessLanguage + ":");
                    console.log(theWitnessObject[elementKey]);
                    console.log();
                    OK = false;
                } else if (theObject[elementKey] == null || targetType !== (typeof theObject[elementKey])) {
                    console.log(elementLang + " - " + elementKey + " - " + (typeof theObject[elementKey]));
                    console.log(exploPath);
                    console.log("Value in " + witnessLanguage + ":");
                    console.log(theWitnessObject[elementKey]);
                    console.log();
                    OK = false;
                }
            }
            if (typeof theWitnessObject[elementKey] === "object") {
                explore(indexLang, exploPath.concat(elementKey))
            }
        }
    } catch (error) {
        OK = false;
    }
}

function start() {
    console.log("Check language started\n");
    console.log(`${languages.length} languages detected:`);
    for (let index = 0; index < languages.length; index++) {
        const element = languages[index];
        console.log("-" + element);
    }
    console.log("\n");

    for (let index = 0; index < languages.length; index++) {
        explore(index, []);
    }

    if (OK) {
        console.log("CheckLanguagesFiles without error");
        process.exit(0);
    } else {
        console.log("CheckLanguagesFiles with errors");
        process.exit(1);
    }
}

start();