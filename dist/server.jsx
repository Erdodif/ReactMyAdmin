const React = require('react');
const { renderToString } = require('react-dom/server');
const App = require('../src/index');
const template = require('../src/template.js');

require('dotenv').config({path:"../.env"});
const express = require('express');
const mysql = require('mysql');
const cors = require('cors');
server = express();

var corsOptions = {
    origin: `http://${process.env.SERVER_HOST}:${process.env.PORT}`
}

server.use(cors(corsOptions));
server.use(express.json());
server.use(express.urlencoded({ extended: true }));

var conn = mysql.createConnection({
    host: process.env.SERVER_HOST,
    user: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD
});

server.get('/index', (req, res) =>{
    const appString = renderToString(new App());

    res.send(template({
        body:appString,
        title:'ReactMyAdmin Főoldal'
    }))
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

server.get('/api/', (req, res) => {
    try {
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

server.post('/api/query',(req,res)=>{
    try {
        let database = req.body["database"];
        let sql = req.body["sql"];
        connectToDatabase(database)
        .then(()=>{
            conn.query(sql, (err, result) => {
                if (err) {
                    return res.status(400).json({ error: err });
                }
                return res.status(200).json({ result: result});
            });
        })
        .catch(()=>{
            return res.status(404).json({ error: "Database not found." });
        });
    }
    catch (e) {
        console.log(e);
        return res.status(500).json({ error: e });
    }
});

server.get('/api/:database', (req, res) => {
    try {
        let database = req.params["database"];
        connectToDatabase(database)
            .then(() => {
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
                return res.status(404).json({ error: "Database not found." });
            });
    }
    catch (e) {
        console.log(e);
        return res.status(500).json({ error: e });
    }
});

server.get('/api/:database/:table', (req, res) => {
    try {
        let database = req.params["database"];
        let table = req.params["table"];
        connectToDatabase(database)
            .then(() => {
                let sql = "SELECT * FROM `" + table + "`";
                conn.query(sql, (err, result) => {
                    if (err) {
                        console.error(err);
                        return res.status(404).json({ error: "Table not found." });
                    }
                    return res.status(200).json({ content: result });
                });
            })
            .catch((err) => {
                return res.status(404).json({ error: "Database not found." });
            });
    }
    catch (e) {
        console.log(e);
        return res.status(500).json({ error: e });
    }
});

const PORT = process.env.SERVER_PORT || 8080;

server.listen(PORT, () => {
    console.log(`Server running on port :${PORT}.`)
});
