import { Sequelize } from 'sequelize';
import DatabaseInterface from './DatabaseInterface.mjs';

export default class SQLiteDatabase extends DatabaseInterface {
    constructor() {
        super();
        this.sequelize = new Sequelize({
            dialect: 'sqlite',
            storage: ':memory:',
        });
    }

    async connect() {
        try {
            await this.sequelize.authenticate();
            console.log('Connection to SQLite in-memory database has been established successfully.');
        } catch (error) {
            console.error('Unable to connect to the SQLite database:', error);
        }
    }

    async disconnect() {
        await this.sequelize.close();
    }
}