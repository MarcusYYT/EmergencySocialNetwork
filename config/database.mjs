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

export {sequelize}