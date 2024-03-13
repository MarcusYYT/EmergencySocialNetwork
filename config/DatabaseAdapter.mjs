import MySQLDatabase from './MySQLDatabase.mjs';
import SQLiteDatabase from './SQLiteDatabase.mjs';

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