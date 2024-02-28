import MySQLDatabase from './MySQLDatabase.mjs';
import SQLiteDatabase from './SQLiteDatabase.mjs';

export default class DatabaseFactory {
    static createDatabase() {
        const databaseMap = {
            'test': SQLiteDatabase,
            'default': MySQLDatabase
        };

        const DatabaseClass = databaseMap[process.env.NODE_ENV] || databaseMap['default'];
        return new DatabaseClass();
    }
}