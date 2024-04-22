import DatabaseAdapter from '../../config/DatabaseAdapter.js';
import {sync as rimrafSync} from "rimraf";

let database;

beforeAll(async () => {
    DatabaseAdapter.setTestDatabaseName("I5_db.sqlite")
    DatabaseAdapter.setCurrentDatabase('test')
    database = DatabaseAdapter.getDatabase()
    await database.authenticate();// Connect to the database
    await DatabaseAdapter.reinitializeModels();
});

afterAll(async () => {
    await database.close();// Disconnect from the database
    await new Promise(resolve => setTimeout(resolve, 1000));
    rimrafSync('./I5_db.sqlite');
});


describe('Search Users', () => {

    test('Create Users', async () => {
        expect(await createNewUser('Tommy', 'password')).toMatchObject({
            success: true,
            user_id: expect.any(Number),
            message: "Create user successfully."
        });
        expect(await createNewUser('Jacky', 'password')).toMatchObject({
            success: true,
            user_id: expect.any(Number),
            message: "Create user successfully."
        });
        expect(await createNewUser('Justin', 'password')).toMatchObject({
            success: true,
            user_id: expect.any(Number),
            message: "Create user successfully."
        });
        expect(await createNewUser('Hakan', 'password')).toMatchObject({
            success: true,
            user_id: expect.any(Number),
            message: "Create user successfully."
        });
    });
});