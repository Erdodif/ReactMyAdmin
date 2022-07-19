import mysql from 'mysql';

export default class MysqlConnector {
    static getConn(host,user,password) {
        return mysql.createConnection({
            host: host,
            user: user,
            password: password
        })
    }
};