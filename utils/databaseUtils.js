import DatabaseAdapter from '../config/DatabaseAdapter.js';
import fs from 'fs';

export async function initializeDatabase() {
    if (process.env.NODE_ENV === 'test') {
        DatabaseAdapter.setTestDatabaseName("tempdb.sqlite");
        DatabaseAdapter.setCurrentDatabase('test');
        const database = DatabaseAdapter.getDatabase();
        await database.authenticate();
        console.log("Connected to in-memory test database");
    } else {
        DatabaseAdapter.setCurrentDatabase('default');
        const database = DatabaseAdapter.getDatabase();
        await database.authenticate();
        console.log("Connected to MySQL database");
    }
    console.log("initializing models...")
    await DatabaseAdapter.reinitializeModels();
    console.log("done")
}

export function cleanUpDatabase() {
    if (fs.existsSync('./tempdb.sqlite')) {
        fs.unlink('./tempdb.sqlite', (err) => {
            if (err) console.error('Failed to delete database file:', err);
            else console.log('Database file deleted successfully.');
        });
    } else {
        console.log('Database file does not exist, no need to delete.');
    }
}
