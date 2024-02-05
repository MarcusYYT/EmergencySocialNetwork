import mysql from 'mysql2';
import { Sequelize, DataTypes} from 'sequelize'

// TO-DO, add database config
const sequelize = new Sequelize(
    'Emergency_Social_Network',
    'root',
    'sb1sb1',
    {
        host: '34.102.56.250',
        dialect: 'mysql'
    }
)

sequelize.authenticate().then(() => {
    console.log('Connection has been established successfully.');
 }).catch((error) => {
    console.error('Unable to connect to the database: ', error);
 });

 const User = sequelize.define('User', {
    userId: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    username: {
        type: DataTypes.STRING,
        allowNull:false
    },
    password: {
        type: DataTypes.STRING,
        allowNull:false
    }
 });

/*
const pool = mysql.createPool({
    host: '34.102.56.250',
    user: 'root',
    password: 'sb1sb1',
    database: 'Emergency_Social_Network',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

pool.getConnection(function(err, connection) {
    console.log("connection")
});*/

export {sequelize, User}