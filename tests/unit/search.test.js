import DatabaseAdapter from '../../config/DatabaseAdapter.js';
import {sync as rimrafSync} from "rimraf";
import {searchUser, searchPosts, searchPrivatePosts, searchStatusHistory, searchAnnouncements} from "../../services/searchService.js";
import { createNewUser } from "../../services/userService.js";
import { checkIfStopWord } from '../../services/searchService.js';
import { createNewPost } from '../../services/postService.js';
import { createPrivatePost } from '../../services/privatePostService.js';
import { createNewStatus } from '../../services/statusService.js';
import { createNewAnnouncement } from '../../services/announcementService.js';

let database;

beforeAll(async () => {
    DatabaseAdapter.setTestDatabaseName("search_unit_db.sqlite")
    DatabaseAdapter.setCurrentDatabase('test')
    database = DatabaseAdapter.getDatabase()
    await database.authenticate();// Connect to the database
    await DatabaseAdapter.reinitializeModels();
});

afterAll(async () => {
    await database.close();// Disconnect from the database
    await new Promise(resolve => setTimeout(resolve, 1000));
    rimrafSync('./search_unit_db.sqlite');
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

    test('1 search on public post - 1', async () => {
        await createNewPost(1, '1', "OK")
        await createNewPost(2, '2', "OK")
        await createNewPost(1, '3', "OK")
        await createNewPost(2, '4', "OK")
        await createNewPost(1, '5', "OK")
        await createNewPost(2, '6', "OK")
        await createNewPost(1, '7', "OK")
        await createNewPost(2, '8', "OK")
        expect(await searchPosts("1")).toMatchObject({success: true, 
            data: [{
                "createdAt": expect.anything(),
                "status": "OK",
                "updatedAt": expect.anything(),
                "user_id": 1,
                "post_id": 1,
                "content":"1"
            }]
        });
    });
    test('2 search on public post - 2', async () => {
        expect(await searchPosts("2")).toMatchObject({success: true, 
            data: [{
                "createdAt": expect.anything(),
                "status": "OK",
                "updatedAt": expect.anything(),
                "user_id": 2,
                "post_id": 2,
                "content":"2"
            }]
        });
    });

    test('3 search on public post - 3', async () => {
        expect(await searchPosts("9")).toMatchObject({success: true, 
            data: []
        });
    });


    test('4 Search n', async () => {
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

    test('5 search on private post - 1', async () => {
        await createPrivatePost(1, 2, 'msg1', "OK");
        await createPrivatePost(1, 2, 'msg2', "OK");
        await createPrivatePost(2, 1, 'msg3', "OK");
        await createPrivatePost(2, 1, 'msg4', "OK");
        expect(await searchPrivatePosts(1, 2,"1")).toMatchObject({success: true, 
            data: [{
                "post_id": expect.any(Number),
                "updatedAt": expect.anything(),
                "createdAt": expect.anything(),
                "sender_id": 1,
                "receiver_id": 2,
                "sender_read": true,
                "receiver_read": false,
                "content": "msg1",
                "status": "OK"
            }]
        });
    });

    test('6 search on private post - 2', async () => {
        let result = await searchPrivatePosts(1, 2,"msg")
        expect(result.data.length).toBe(4);
    });

    test('7 search on private post - 3', async () => {
        let result = await searchPrivatePosts(1, 3,"msg")
        expect(result.data.length).toBe(0);
    });

    test('8 search on private post Status - 1', async () => {
        createNewStatus(1, "Emergency")
        let result = await searchStatusHistory(1)
        expect(result.data.length).toBe(1);
        expect(result.data[0].status).toBe("Emergency")
    });

    test('9 search on private post Status - 1', async () => {
        let result = await searchStatusHistory(2)
        expect(result.data.length).toBe(0);
    });

    test('10 search on Announcement', async () => {

        await createNewAnnouncement(1, "test announcement")
    
        let result = await searchAnnouncements("test")
        expect(result.data.length).toBe(1);
        expect(result.data[0].content).toBe("test announcement");
    });


    test('Stop word 1', async () => {
        expect(await checkIfStopWord("able")).toMatchObject({success: false});
    });

    test('Stop word 2', async () => {
        expect(await checkIfStopWord("about")).toMatchObject({success: false});
    });

    
});