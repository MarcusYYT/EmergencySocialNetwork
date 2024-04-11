import { createNewThread, ifThreadNameExists, getThreadByName, editThread, getThreadById, deleteThread, getThreadList} from "../../services/threadService.js";
import { createNewUser } from "../../services/userService.js";
import DatabaseAdapter from '../../config/DatabaseAdapter.js'; 
import { sync as rimrafSync } from 'rimraf';

let database
beforeAll(async () => {
  DatabaseAdapter.setTestDatabaseName("unit_db.sqlite")
  DatabaseAdapter.setCurrentDatabase('test')
  database = DatabaseAdapter.getDatabase()
  await database.authenticate();// Connect to the database
  await DatabaseAdapter.reinitializeModels();
  await createNewUser('Person3', 'password')
});

afterAll(async () => {
  await database.close();// Disconnect from the database
  await new Promise(resolve => setTimeout(resolve, 1000));
  rimrafSync('./unit_db.sqlite');
});

describe('Thread Name should not already exist in database', () => {

    test('You should be able to create a thread', async () => {
        //creatorId, threadName, urgency, tags
        expect(await createNewThread(1, 'need help', 'High Pirioity', ["Info"])).toMatchObject({
            success: true, 
            data: expect.any(Object), 
            message: "Create thread successful"
        });
    });

    test('Thread Name is in the database so it should be true', async () => {
        expect(await ifThreadNameExists('need help')).toBe(true);
    });

    test('Thread Name is not in the database so it should be false', async () => {
        expect(await ifThreadNameExists('I do need help')).toBe(false);
    });

    test('You should be able to see that the thread exists with data', async () => {
        expect(await getThreadById(1)).toMatchObject({
            exist: true, 
            data: expect.any(Object), 
        });
    });

});

describe('You should be able to edit a thread', () => {

    test('Thread Name is in the database so it should be true', async () => {
        expect(await getThreadByName('need help')).toMatchObject({
            exist: true, 
            data: expect.any(Object), 
        });
    });

    test('You should be able to edit a thread', async () => {
        expect(await editThread(1, 'I do not need help', 'Low Priority', ["Info", "Volunteering"])).toMatchObject({
            message: "Edit thread list successful",
            success: true, 
            data: [1], 
        });
    });

    test('Thread Name should have been changed', async () => {
        expect(await ifThreadNameExists('I do not need help')).toBe(true);
    });

});


describe('You should be able to delete a thread', () => {
    test('You should be able to delete a thread', async () => {
        expect(await deleteThread(1)).toMatchObject({
            message: "Delete thread list successful",
            data: 1
        });
    });

    test('Thread Name should have been changed so the old one should not exist', async () => {
        expect(await ifThreadNameExists('I do not need help')).toBe(false);
    });

});



  
  