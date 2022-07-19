import 'mysql';
import * as dotenv from 'dotenv';
dotenv.config({ path: "../.env" });
import MysqlConnector from '../database/mysqlConnector.js';
let conn = MysqlConnector.getConn(
    process.env.SERVER_HOST,
    process.env.DATABASE_USER,
    process.env.DATABASE_PASSWORD
)

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

export class Database {
    static all(req, res) {
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
    };

    static query(req, res) {
        try {
            let database = req.params["database"];
            let sql = req.body["sql"];
            connectToDatabase(database)
                .then(() => {
                    conn.query(sql, (err, result) => {
                        if (err) {
                            return res.status(400).json({ error: err });
                        }
                        return res.status(200).json({ result: result });
                    });
                })
                .catch(() => {
                    return res.status(404).json({ error: "Database not found." });
                });
        }
        catch (e) {
            console.log(e);
            return res.status(500).json({ error: e });
        }
    }

    static queryNoContext(req, res) {
        try {
            let sql = req.body["sql"];
            conn.query(sql, (err, result) => {
                if (err) {
                    return res.status(400).json({ error: err });
                }
                return res.status(200).json({ result: result });
            });
        }
        catch (e) {
            console.log(e);
            return res.status(500).json({ error: e });
        }
    }

    static get(req, res) { res.sendStatus(200) };
}

export class Tables {

    static all(req, res) {
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
    }

    static get(req, res) {
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
    }
}
