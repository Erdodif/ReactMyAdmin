const express = require('express');
const cors = require('cors');
const app = express();
const mysql = require('mysql');
var corsOptions = {
    origin: "http://localhost:8001"
}
app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

var conn = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: ""
});

function getResultByName(list, name) {
    let out = [];
    for (const element of list) {
        out.push(element[name]);
    }
    return out;
}


function connectToDatabase(database) {
    return new Promise((resolve, reject) => {
        conn.query("USE " + database + ";", (err, result) => {
            if (err) reject(err);
            resolve(result);
        });
    });
};

conn.connect(function (err) {
    if (err) throw err;
    console.log("Database connected");
})

app.get('/', (req, res) => {
    console.log("get incoming");
    try {
        console.log("get incoming /");
        conn.query("SHOW DATABASES", (err, result) => {
            if (err) return res.status(500).json({ error: err });
            let out = getResultByName(result, "Database");
            return res.status(200).json({ "databases": out });
        });
    }
    catch (e) {
        console.error(e);
        return res.status(500).json({ error: 'There might be a problem' });
    }
});

app.get('/:database', (req, res) => {
    try {
        let database = req.params["database"];
        console.log("get incoming /" + database);
        connectToDatabase(database)
            .then(() => {
                console.log("Using database " + database);
                let sql = "SHOW TABLES";
                conn.query(sql, (err, result) => {
                    if (err) {
                        console.error(err);
                        return res.status(500).json({ error: err });
                    }
                    let out = getResultByName(result, "Tables_in_" + database);
                    return res.status(200).json({ tables: out });
                });
            })
            .catch((err) => {
                console.log("Database \"" + database + "\" not found")
                return res.status(404).json({ error: "Database not found." });
            });
    }
    catch (e) {
        console.log(e);
        return res.status(500).json({ error: e });
    }
});
/*
app.get('/:database', (req, res) => {
    try {
        let database = req.params["database"];
        console.log("get incoming /" + database);
        conn.query("USE " + database + ";", (err, result) => {
            if (err) {
                console.log("Database \"" + database + "\" not found")
                return res.status(404).json({ error: "Database not found." });
            }
            console.log("Using database " + database);
            let sql = "SHOW TABLES";
            conn.query(sql, (err, result) => {
                if (err) {
                    console.error(err);
                    return res.status(500).json({ error: err });
                }
                let out = getResultByName(result, "Tables_in_" + database);
                return res.status(200).json({ tables: out });
            });
        });
    }
    catch (e) {
        console.log(e);
        return res.status(500).json({ error: e });
    }
});*/

const PORT = process.env.PORT || 8080;

app.listen(PORT, () => {
    console.log(`Running on port ${PORT}.`)
});