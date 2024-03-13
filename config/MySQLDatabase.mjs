// MySQL databse adapter
import { Sequelize } from 'sequelize';
import DatabaseInterface from './DatabaseInterface.mjs';

export default class MySQLDatabase extends DatabaseInterface {
    constructor() {
        super();
        this.sequelize = new Sequelize('Emergency_Social_Network', 'root', 'sb1sb1', {
            host: '34.102.56.250',
            dialect: 'mysql',
            logging: false
        });
    }

    async connect() {
        try {
            await this.sequelize.authenticate();
            console.log('MySQL Connection has been established successfully.');
        } catch (error) {
            console.error('Unable to connect to the database:', error);
        }
    }

    async disconnect() {
        await this.sequelize.close();
    }
}