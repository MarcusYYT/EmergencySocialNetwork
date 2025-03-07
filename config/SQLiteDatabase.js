import { Sequelize } from 'sequelize';

export default class SQLiteDatabase {
    constructor(filename='tempdb.sqlite') {
        this.sequelize = new Sequelize({
            dialect: 'sqlite',
            storage: filename,
            logging: false
        });
    }
}