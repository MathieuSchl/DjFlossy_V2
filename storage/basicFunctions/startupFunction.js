const fs = require("fs");
const {
    Collection
} = require("discord.js");

function getAllFuncions(collection, folderName, pathElement) {
    const files = fs.readdirSync(pathElement);

    var jsFiles = files.filter(f => f.split(".").pop() === "js");
    if (jsFiles.length > 0) {

        let nbFile = 0;
        jsFiles.forEach((f, i) => {
            nbFile++;
            var fileGet = require(pathElement + f);
            collection.set(fileGet.help.name, fileGet)
        });
        if (nbFile === 1) console.log(nbFile + " command file from the \"" + folderName + "\" folder have been added");
        else console.log(nbFile + " commands files from the \"" + folderName + "\" folder have been added");
    }
}

function getAllFunctionsFromFolder(client, path, banFolders) {
    const folders = fs.readdirSync(path);
    for (let folderInd = 0; folderInd < folders.length; folderInd++) {
        const element = folders[folderInd];
        const pathElement = path + element + "/";
        if (fs.lstatSync(pathElement).isDirectory()) {
            if (!banFolders.includes(element)) {
                client[element] = new Collection();
                try {
                    getAllFuncions(client[element], element, pathElement);
                } catch (e) {
                    console.log(e);
                }
            }
        }
    }
}

module.exports.loadFunctions = (client) => {
    //load all folder
    const path = client.location + "storage/";
    getAllFunctionsFromFolder(client, path, ["data", "dataBase", "textChannel", "message", "button", "selectMenu", "command", "newMemberAction", "guildCreateAction", "guildDeleteAction"]);

    //load all special folder
    client["message"] = {};
    getAllFunctionsFromFolder(client["message"], path + "message/", []);

    client["textChannel"] = {};
    getAllFunctionsFromFolder(client["textChannel"], path + "textChannel/", []);

    client["button"] = {};
    getAllFunctionsFromFolder(client["button"], path + "button/", []);

    client["selectMenu"] = {};
    getAllFunctionsFromFolder(client["selectMenu"], path + "selectMenu/", []);

    client["command"] = {};
    getAllFunctionsFromFolder(client["command"], path + "command/", []);

    client["newMemberAction"] = {};
    getAllFunctionsFromFolder(client["newMemberAction"], path + "newMemberAction/", []);

    client["guildCreateAction"] = {};
    getAllFunctionsFromFolder(client["guildCreateAction"], path + "guildCreateAction/", []);

    client["guildDeleteAction"] = {};
    getAllFunctionsFromFolder(client["guildDeleteAction"], path + "guildDeleteAction/", []);

    //load dataBase (mariaDB or json)
    const useSQLdb = require("../dataBase/dbConfig.json").useSQLdb;
    client["dataBase"] = new Collection();
    if (useSQLdb) {
        getAllFuncions(client["dataBase"], "dataBase", path + "dataBase/mariaDB/");
    } else {
        getAllFuncions(client["dataBase"], "dataBase", path + "dataBase/json/");
    }
    return;
};

module.exports.checkConfig = (client) => {
    let allGood = true;

    //check if the config file is good
    if (!fs.existsSync(client.location + "config.json")) {
        allGood = false;
        const config = {
            "token": "YourTockenHere",
            "prefix": "YourPrefixHere",
            "defaultGuildLanguage": null,
            "defaultUserLanguage": null
        };
        const data = JSON.stringify(config);
        fs.writeFileSync(client.location + "config.json", data);
        console.log("The config file as been created here\n" +
            client.location + "config.json\n" +
            "Please put your Discord bot tocken and your prefix\n");
    } else {
        client.config = require(client.location + "config.json");
        fichiers = fs.readFileSync(client.location + "config.json");
        const config = JSON.parse(fichiers);
        if (config.token === "YourTockenHere") {
            allGood = false;
            console.log("The tocken of your discord bot is missing.\n" +
                "Please put it in this file\n" +
                client.location + "config.json\n");
        }
        if (config.prefix === "YourPrefixHere") {
            allGood = false;
            console.log("The prefix of your discord bot is missing.\n" +
                "Please put it in this file\n" +
                client.location + "config.json\n");
        }
    }


    //check if the database config file is good
    if (!fs.existsSync(client.location + "storage/dataBase/dbConfig.json")) {
        allGood = false;
        const dbConfig = {
            "useSQLdb": false,
            "host": "hostHere",
            "user": "userHere",
            "password": "passwordHere",
            "database": "databaseHere"
        };
        const data = JSON.stringify(dbConfig);
        fs.writeFileSync(client.location + "storage/dataBase/dbConfig.json", data);
        console.log("The dbconfig file as been created here\n" +
            client.location + "storage/dataBase/dbConfig.json\n" +
            "Please set your db information for the connection if you want to use it\n");
    } else {
        fichiers = fs.readFileSync(client.location + "storage/dataBase/dbConfig.json");
        const config = JSON.parse(fichiers);
        if (config.useSQLdb) {
            if (config.host === "hostHere") {
                allGood = false;
                console.log("The host to the data base connection is missing.\n" +
                    "Please put it in this file\n" +
                    client.location + "storage/dataBase/dbConfig.json\n");
            }
            if (config.user === "userHere") {
                allGood = false;
                console.log("The user to the data base connection is missing.\n" +
                    "Please put it in this file\n" +
                    client.location + "storage/dataBase/dbConfig.json\n");
            }
            if (config.password === "passwordHere") {
                allGood = false;
                console.log("The password to the data base connection is missing.\n" +
                    "Please put it in this file\n" +
                    client.location + "storage/dataBase/dbConfig.json\n");
            }
            if (config.database === "databaseHere") {
                allGood = false;
                console.log("The name of the database for the connection is missing.\n" +
                    "Please put it in this file\n" +
                    client.location + "storage/dataBase/dbConfig.json\n");
            }
        }
    }

    //check if data folder exist
    if (!fs.existsSync(client.location + "storage/data")) fs.mkdirSync(client.location + "storage/data");

    if (!allGood) {
        process.exit(0);
    }
}

module.exports.help = {
    name: "startupFunction"
};