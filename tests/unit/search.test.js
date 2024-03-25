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
    database = DatabaseAdapter.createDatabase('unit_db.sqlite'); // Create a new instance of the database
    await database.connect(); // Connect to the database
    await User.sync({ force: true });
    await Post.sync({ force: true });
    await PrivatePost.sync({ force: true });
    await Status.sync({ force: true });
});

afterAll(async () => {
    await database.disconnect();// Disconnect from the database
    await new Promise(resolve => setTimeout(resolve, 1000));
    rimrafSync('./unit_db.sqlite');
});

describe('Create some users', () => {

    test('Create', async () => {
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

describe('Search Users', () => {

    test('Search n', async () => {
        expect(await searchUser("n")).toMatchObject({
            success: true,
            data: expect.anything(),
        });
    });
});