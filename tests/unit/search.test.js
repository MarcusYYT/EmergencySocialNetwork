import {User} from "../../models/User.model.js";
import DatabaseAdapter from '../../config/DatabaseAdapter.js';
import {Post} from "../../models/Post.model.js";
import {PrivatePost} from "../../models/PrivatePost.model.js";
import {Status} from "../../models/Status.model.js";
import {sync as rimrafSync} from "rimraf";
import {searchUser} from "../../services/searchService.js";
import {getUserList} from "../../services/userService.js";
import { createNewUser } from "../../services/userService.js";

let database
beforeAll(async () => {
    DatabaseAdapter.setTestDatabaseName("search_db.sqlite")
    DatabaseAdapter.setCurrentDatabase('test')
    database = DatabaseAdapter.getDatabase()
    await database.authenticate();// Connect to the database
    await DatabaseAdapter.reinitializeModels();
});

afterAll(async () => {
    await database.close();// Disconnect from the database
    await new Promise(resolve => setTimeout(resolve, 1000));
    rimrafSync('./search_db.sqlite');
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

    test('Search n', async () => {
        expect(await searchUser("n")).toMatchObject({
            success: true,
            data:  [
                      {
                   "createdAt": expect.anything(),
                       "online_status": "online",
                       "password": expect.anything(),
                       "status": "place_holder",
                       "updatedAt": expect.anything(),
                       "user_id": expect.any(Number),
                       "username": "Justin",
                     },
              {
                   "createdAt": expect.anything(),
                       "online_status": "online",
                      "password": expect.anything(),
                      "status": "place_holder",
                       "updatedAt": expect.anything(),
                       "user_id": expect.any(Number),
                       "username": "Hakan",
                     },
           ],
        });
    });
});