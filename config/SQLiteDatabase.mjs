import { Sequelize } from 'sequelize';
import DatabaseInterface from './DatabaseInterface.mjs';

export default class SQLiteDatabase extends DatabaseInterface {
    constructor(filename='tempdb.sqlite') {
        super();
        this.sequelize = new Sequelize({
            dialect: 'sqlite',
            storage: filename,
            logging: false
        });
    }

    async connect() {
        try {
            await this.sequelize.authenticate();
            console.log('Connecting to SQLite in-memory database.');
        } catch (error) {
            console.error('Unable to connect to the SQLite database:', error);
        }
    }

    async disconnect() {
        try {
            await this.sequelize.close();
            console.log('Disconnected from SQLite database.');
        } catch (error) {
            console.error('Error disconnecting from the SQLite database:', error);
        }
    }
}