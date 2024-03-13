import { validUser, createNewUser, changeStatus, changeOnlineStatus } from "../../services/userService.mjs";
import {User} from "../../models/User.model.mjs";
import {Post} from "../../models/Post.model.mjs";
import {PrivatePost} from "../../models/PrivatePost.model.mjs";
import {Status} from "../../models/Status.model.mjs";
import {response} from "express";
import fetch from 'node-fetch';
import { createServer } from "http";
import app from "../../app.mjs";

const server = createServer(app);
const serverUrl = `http:// localhost:3000`;
beforeAll(() => {
    server.listen(4000, async () => {
        done();
    })
});

afterAll((done) =>{
    server.close(done);
})

describe("Register user", () => {
    test('user registration', async() => {
        const response = await fetch(`${serverUrl}/auth/register`, {
            method: 'POST',
            header: {
                'Content-Type' : 'application/json',
            },
            body: JSON.stringify({username: "testuser", password: "test"})
        });
        const data = await response.json();
        console.log(data);
        expect(data).toMatchObject(expect.any(Object));
        
    })
});




// describe('User registration and login', () => {

//     test('User registration', async () => {
//         expect(await createNewUser('Carnegie', 'Mellon')).toMatchObject({
//             success: true,
//             user_id: expect.any(Number),
//             message: "Create user successfully."
//         });
//     });

//     test('User login with correct credential', async () => {
//         expect(await validUser('Carnegie', 'Mellon')).toMatchObject({
//             code: 200,
//             user_id: expect.any(Number),
//         });
//     });

//     test('User login with incorrect credential', async () => {
//         expect(await validUser('Carnegie', 'Mellon2')).toMatchObject({
//             code: 401,
//             user_id: null,
//         });
//     });

//     test('User login with unexist user', async () => {
//         expect(await validUser('Carnegie22', 'Mellon')).toMatchObject({
//             code: 404,
//             user_id: null,
//         });
//     });
// });

// describe('User status update', () => {
//     let sharedUserId;
//     test('User registration', async () => {
//         const response = await createNewUser('Carnegieeee', 'Mellon');
//         expect(response).toMatchObject({
//             success: true,
//             user_id: expect.any(Number),
//             message: "Create user successfully."
//         });
//         sharedUserId = response.user_id;
//     });

//     test('User status update to emergency', async () => {
//         expect(await changeStatus(sharedUserId, 'emergency')).toMatchObject({
//             success: true,
//             message: "Change status successfull"
//         });
//     });

//     test('User online status update to offline', async () => {
//         expect(await changeOnlineStatus(sharedUserId, 'offline')).toMatchObject({
//             success: true,
//             message: `Change online for user ${sharedUserId} status successfull`
//         });
//     });

// });