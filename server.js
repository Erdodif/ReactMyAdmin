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

conn.connect(function (err) {
    if (err) throw err;
    console.log("Database connected");
})

app.get('/', (req, res) => {
    try {
        console.log("get incoming");
        conn.query("SHOW DATABASES", (err, result) => {
            if (err) return res.status(500).json({ error: err });
            return res.status(200).json(result);
        });
    }
    catch (e) {
        console.error(e);
        return res.status(500).json({ error: 'There might be a problem' });
    }

});

const PORT = process.env.PORT || 8080;

app.listen(PORT, () => {
    console.log(`Running on port ${PORT}.`)
});