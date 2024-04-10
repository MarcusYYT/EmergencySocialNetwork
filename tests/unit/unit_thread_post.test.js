import { createNewThreadPost, getThreadPostById, getThreadPostList } from "../../services/threadPostService.js";
import { createNewThread } from "../../services/threadService.js";
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
  await createNewUser('Tommy', 'password')
  await createNewThread(1, 'need assistance', 'High Pirioity', ["Info"])
});

afterAll(async () => {
  await database.close();// Disconnect from the database
  await new Promise(resolve => setTimeout(resolve, 1000));
  rimrafSync('./unit_db.sqlite');
});

describe('You should be able to create a thread post and get its id', () => {

    test('You should be able to create a thread post', async () => {
        expect(await createNewThreadPost(1, 'need help', 'emergency', 1)).toMatchObject({
            success: true, 
            data: expect.any(Object), 
            message: "Create thread post successful"
        });
    });

    test('You should be able get a thread post by id', async () => {
        expect(await getThreadPostById(1)).toMatchObject({
            exist: true,
            data: expect.any(Array)
        });
    });

});

describe('You should be able get a list of thread posts', () => {
    
    test('You should be able get a list of thread posts', async () => {
        expect(await getThreadPostList(1)).toMatchObject({
            message: "Fetch post list successful",
            data: expect.any(Array)
        });
    });
});




  
  