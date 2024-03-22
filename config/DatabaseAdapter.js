import MySQLDatabase from './MySQLDatabase.js';
import SQLiteDatabase from './SQLiteDatabase.js';

export default class DatabaseAdapter {
    static createDatabase(filename) {
        const databaseMap = {
            'test': () => new SQLiteDatabase(filename),
            'default': () => new MySQLDatabase()
        };

        const DatabaseClass = databaseMap[process.env.NODE_ENV] || databaseMap['default'];
        return DatabaseClass();
    }
}