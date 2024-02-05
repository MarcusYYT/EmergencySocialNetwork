import {sequelize}  from '../config/database.mjs';

// TO-DO
export async function Authenticate() {
    // Logic to check the database to valid user
    // const [rows, fields] = await db.query('SELECT * FROM users WHERE username = ? AND password = ?', [username, password]);
    // const users = db.query('SELECT * from user"');
    console.log(users)
    
    return 0;
}

export async function CheckUserExist(username) {
    // db.query("Select username from user where username = " + username)
}