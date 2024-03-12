import { Sequelize } from 'sequelize';
import DatabaseInterface from './DatabaseInterface.mjs';

export default class SQLiteDatabase extends DatabaseInterface {
    constructor() {
        super();
        this.sequelize = new Sequelize({
            dialect: 'sqlite',
            storage: 'tempdb.sqlite',
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
        await this.sequelize.close();
    }
}