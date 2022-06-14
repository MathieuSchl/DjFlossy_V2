const fs = require('fs');
const config = require('./storage/dataBase/dbConfig.json');


async function importSqlTables(file) {
    await new Promise((resolveImport, reject) => {
        require("./storage/dataBase/mariaDB/connection").open(async (db) => {

            const executeQuery = require("./storage/dataBase/mariaDB/connection").exec;
            const dbName = config.database;
            await new Promise((resolve, resject) => {
                executeQuery(db, "CREATE DATABASE IF NOT EXISTS ??", [dbName], () => {
                    resolve();
                });
            })
            await new Promise((resolve, resject) => {
                executeQuery(db, "USE ??", [dbName], () => {
                    resolve();
                });
            })
            await new Promise((resolve) => {
                fs.readFile(file, 'utf8', async (err, data) => {
                    if (err) {
                        console.error(err)
                        return
                    }
                    const lineData = data.split("\n")
                    for (const line of lineData) {
                        if (line !== "\r" || line !== "") {
                            await new Promise(async (resolveExec) => {
                                const res = await executeQuery(db, line, [], (error, results, fields) => {
                                    if (res && res[0] && (res[0].code !== "ER_DUP_ENTRY") && res[0].sql.length > 5) console.log(res[0]);
                                    resolveExec()
                                });
                            })
                        }
                    }

                    await require("./storage/dataBase/mariaDB/connection").close(db);
                    resolve();
                })
            })
            resolveImport()
        })
    })
}


async function start() {
    await importSqlTables('./globalData.sql');
    console.log("The database is ready\n\n");
}

start()