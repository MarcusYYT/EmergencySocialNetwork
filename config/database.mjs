import mysql from 'mysql2';

// TO-DO, add database config
const pool = mysql.createPool({
    host: 'localhost',
    user: 'your_username',
    password: 'your_password',
    database: 'your_database_name',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

export const db = pool.promise();