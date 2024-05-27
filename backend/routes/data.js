const express = require("express");
const multer = require("multer");
const fs = require("fs");
const csv = require("csv-parser");
const sqlite3 = require("sqlite3").verbose();
const router = express.Router();

const db = new sqlite3.Database("./database/database.db");

const storage = multer.diskStorage({
    destination: (request, file, callback) => {
        callback(null, "./uploads/")
    },
    filename: (request, file, callback) => {
        callback(null, file.originalname + "@" + Date.now() + "_" + Math.round(Math.random() * 1E9));
    }
});

upload = multer({ storage: storage });

var files;
var filenames = []
const TABLE_PREFIX = "TABLE_";

router.post("/", upload.array("files"), (request, response) => {
    files = request.files;
    filenames.map(filename => {
        db.run(`DROP TABLE "${TABLE_PREFIX}${filename}"`);
    });
    filenames = [];
    
    files.forEach(file => {
        filenames.push(file.filename);

        const headers = [];
        const rowsList = [];
        const tableName = `${TABLE_PREFIX}${file.filename}`;

        fs.createReadStream(file.path)
            .pipe(csv())
            .on("headers", (headersList) => createTables(headersList, tableName)
                .then((headersUpdate) => {
                    headersUpdate.map(h => headers.push(h));
                    fs.createReadStream(file.path)
                        .pipe(csv())
                        .on("data", (data) => {
                            rowsList.push(data);
                        })
                        .on("end", () => {
                            const placeholders = headers.map(() => "?").join(", ");
                            const insertQuery = db.prepare(`INSERT INTO "${tableName}" (${headers.map(h => h.replaceAll(/[^a-zA-Z]/g, "").toLowerCase()).join(", ")}) VALUES (${placeholders})`);

                            rowsList.forEach(row => {
                                const values = headers.map(header => row[header]);
                                insertQuery.run(values, err => {
                                    if (err) {
                                        console.error("ERROR: Unable to insert row data\n\t" + row);
                                    }
                                });
                            })

                            insertQuery.finalize(err => {
                                if (err) {
                                    console.error("ERROR: Unable to conclude queries");
                                }
                                fs.unlinkSync(`./uploads/${file.filename}`);
                            });
                        })
                })
            );

        });
        
        response.send(filenames);
});

router.get("/", async (request, response) => {
    try {
        const result = await getTableDataAll(filenames);
        response.send(result);
    } catch (error) {
        response.status(500).send(`Oops! There was some error retrieving data.\n${error}`);
    }
});

async function getTableDataAll(filenames) {
    const result = [];

    for (const filename of filenames) {
        result.push({
            title: filename,
            data: await getTableData(filename)
        });
    }

    htmlTables = getHtmlTables(result);

    return htmlTables;
}


const compulsaryFields = ["studentname", "programname", "serialnumber"]
function getHtmlTables(data) {
    var htmlTables = "";

    for (const table of data) {
        // Heading before each table
        htmlTables += `<h3>${table.title.split("@")[0]}</h3><br />`;

        // Each table MUST have a student name, program name, and serial number.
        var allowed = true;
        const keys = Object.keys(table.data[0]).map(key => key.replaceAll(/[^a-zA-Z]/g, "").toLowerCase());
        for (const field of compulsaryFields) {
            if (!keys.includes(field)) {
                htmlTables += `<p style=\"color:red\"><b>This table does not include a ${field} field which is necessary.</b></p>`
                allowed = false;
                break;
            }
        }
        
        if (!allowed) {
            continue;
        }        

        // Begin table and create heading rows
        htmlTables += `<table><tr>`;

        Object.keys(table.data[0]).forEach(key => {
            htmlTables += `<th>${key}</th>`
        });

        htmlTables += `</tr>`;

        // Data rows
        table.data.forEach(row => {
            
            htmlTables += `<tr>`

            Object.values(row).forEach(value => {
                htmlTables += `<td>${value}</td>`
            });

            htmlTables += `</tr>`;
        });

        htmlTables += `</table><br /><br />`
    };

    return htmlTables;
}

function getTableData(table) {
    return new Promise((resolve, reject) => {
        db.all(`SELECT * FROM "${TABLE_PREFIX}${table}"`, async (err, rows) => {
            if (err) {
                return reject(err);
            }

            resolve(rows);
        });
    });
}

function createTables(headersList, tableName) {
    return new Promise((resolve, reject) => {
        const headers = [];
        for (const header of headersList) {
            headers.push(header);
        }

        const columns = headers.map(header => `${header.replaceAll(/[^a-zA-Z]/g, "").toLowerCase()} TEXT`).join(", ");
        console.log(columns);
        const createTableQuery = `CREATE TABLE IF NOT EXISTS "${tableName}" (${columns});`;
        console.log(createTableQuery);

        db.run(createTableQuery, (err) => {
            if (err) {
                console.error("ERROR: Unable to store: " + tableName);
                return reject(err);
            }

            return resolve(headers);
        });
    });
}

module.exports = router;