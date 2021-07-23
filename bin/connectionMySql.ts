import mysql from 'mysql';

const connection = mysql.createConnection({

    host: "localhost",
    user: "root",
    password: "",
    database: "tupaka",
    port: 3306
});

export default connection;