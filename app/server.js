import e,* as express from 'express';
import cors from 'cors';
import './database/mysqlConnector.js'
import MysqlConnector from './database/mysqlConnector.js';
import * as dotenv from 'dotenv';
import path from 'path';
dotenv.config({path:"../.env"});
import {Database, Tables} from './routes/api.js';
import { fileURLToPath } from 'url';
const app = e();
var corsOptions = {
    origin: `http://localhost:${process.env.PORT}`
}

app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

let __dirname = path.dirname(fileURLToPath(import.meta.url));

let conn = MysqlConnector.getConn(
    process.env.SERVER_HOST,
    process.env.DATABASE_USER,
    process.env.DATABASE_PASSWORD
)

conn.connect(function (err) {
    if (err) throw err;
    console.log("Database connected");
})


//let apiRoutes = api(app);

//app.use('/api',apiRoutes);

app.get('/',(req,res) =>{
    let root = __dirname.substring(0, __dirname.lastIndexOf('\\'))+"\\client\\build\\";
    res.sendFile("index.html",{root:root});
});

app.get('/api/databases/:database', Database.get);

app.get('/api/databases/:database/tables', Tables.all);

app.get('/api/databases/:database/tables/:table', Tables.get);

app.get('/api/databases', Database.all);

app.post('/api/query',Database.queryNoContext);

app.post('/api/:databases/query',Database.query);

app.use(express.static(__dirname+"\\client\\build"));
const PORT = process.env.SERVER_PORT || 8080;

app.listen(PORT, () => {
    console.log(`Running on port ${PORT}.`)
});