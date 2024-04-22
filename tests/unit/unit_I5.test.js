import DatabaseAdapter from '../../config/DatabaseAdapter.js';
import {sync as rimrafSync} from "rimraf";
import {createAdminUser, changeUserPrivilege, changeUserActiveStatus, createNewUser, getUserById, updateUserDetails, validUser, ifCanPerformSpeedTest, ifCanPostAnnouncement} from '../../services/userService.js'
import { getPostList, createNewPost } from '../../services/postService.js';
import { getAnnouncementList, createNewAnnouncement } from '../../services/announcementService.js';

let database;

beforeAll(async () => {
    DatabaseAdapter.setTestDatabaseName("I5_db.sqlite")
    DatabaseAdapter.setCurrentDatabase('test')
    database = DatabaseAdapter.getDatabase()
    await database.authenticate();// Connect to the database
    await DatabaseAdapter.reinitializeModels();
    await createAdminUser();
});

afterAll(async () => {
    await database.close();// Disconnect from the database
    await new Promise(resolve => setTimeout(resolve, 1000));
    rimrafSync('./I5_db.sqlite');
});


describe('At least one administrator rule', () => {

    test('change role for only one admin', async () => {
        const changeRoleResult = await changeUserPrivilege(1, 'Citizen');
        expect(changeRoleResult.success).toBe(false);
        expect(changeRoleResult.message).toBe('Cannot remove the only Administrator.');
    });

    test('change active for only one admin', async () => {
        const changeActiveResult = await changeUserActiveStatus(1, false);
        expect(changeActiveResult.success).toBe(false);
        expect(changeActiveResult.message).toBe('Cannot deactivate the only active Administrator.');
    });
});

describe('initial privilege rule', () => {
    test('create new user and initial priviele is citizen', async ()  =>{
        await createNewUser('Person1', 'password');
        const user = await getUserById(2);
        // console.log(user)
        expect(user.data[0].privilege).toBe('Citizen');
    });
});

describe('initial administrator rule', () => {
    test('The first user is the default administrator', async ()  =>{
        const user = await getUserById(1);
        // console.log(user)
        expect(user.data[0].username).toBe('esnadmin');
        expect(user.data[0].status).toBe('OK');
        expect(user.data[0].privilege).toBe('Administrator');
    });
});


describe('Administrator Action Rule', () => {
    test('change the username', async ()  =>{
        let formData = {
            user_id: 2,
            username: 'PersonChanged', 
            password: '',
            privilege: 'Citizen',
            isActive: 'Active'
        }
        await updateUserDetails(formData);
        const user = await getUserById(2);
        // console.log(user)
        expect(user.data[0].username).toBe('PersonChanged');
    });

    test('change the privilege', async ()  =>{
        let formData = {
            user_id: 2,
            username: 'PersonChanged', 
            password: '',
            privilege: 'Coordinator',
            isActive: 'Active'
        }
        await updateUserDetails(formData);
        const user = await getUserById(2);
        // console.log(user)
        expect(user.data[0].privilege).toBe('Coordinator');
    });

    test('change the active', async ()  =>{
        let formData = {
            user_id: 2,
            username: 'PersonChanged', 
            password: '',
            privilege: 'Coordinator',
            isActive: 'Inactive'
        }
        await updateUserDetails(formData);
        const user = await getUserById(2);
        // console.log(user)
        expect(user.data[0].isActive).toBe(false);
    });

    test('Cannot change status', async ()  =>{
        let formData = {
            user_id: 2,
            username: 'Person', 
            password: '',
            privilege: 'Coordinator',
            isActive: 'Active',
            status:'Emergency'
        }
        await updateUserDetails(formData);
        const user = await getUserById(2);
        // console.log(user)
        expect(user.data[0].status).toBe('place_holder');
    });
});


describe('active-inactive rule', () => {
    test('user can login with Active', async ()  =>{
        const loginResult = await validUser('Person', 'password')
        expect(loginResult.code).toBe(200);
        expect(loginResult.user_id).toBe(2);
    });

    test('User cannot login with InActive', async ()=>{
        let formData = {
            user_id: 2,
            username: 'Person', 
            password: '',
            privilege: 'Coordinator',
            isActive: 'Inactive',
        }
        await updateUserDetails(formData);
        const loginResult = await validUser('Person', 'password')
        expect(loginResult.code).toBe(403);
        expect(loginResult.user_id).toBe(null);
    })

    test('User initial is Active', async ()=>{
        await createNewUser('Person2', 'password');
        const user = await getUserById(3);
        expect(user.data[0].isActive).toBe(true);
    })

    test('Inactive Post will not show', async ()=>{
        await createNewPost(2, "test", "OK");
        await createNewPost(2, "test", "OK");
        await createNewPost(2, "test", "OK");

        expect((await getPostList()).data.length).toBe(0);
    })

    test('Inactive Announcement will not show', async ()=>{
        await createNewAnnouncement(2, "test");
        await createNewAnnouncement(2, "test");
        await createNewAnnouncement(2, "test");

        expect((await getAnnouncementList()).data.length).toBe(0);
    })
});

describe('privilege rule', () => {
    test('Citizen cannot post Announcement', async ()  =>{
        expect(await ifCanPostAnnouncement(3)).toBe(false);
    });

    test('Citizen cannot perform Speed Test', async ()  =>{
        expect(await ifCanPerformSpeedTest(3)).toBe(false);
    });

    test('Coordinator can post Announcement', async ()  =>{
        expect(await ifCanPostAnnouncement(2)).toBe(true);
    });

    test('Coordinator cannot perform speed test', async ()  =>{
        expect(await ifCanPerformSpeedTest(2)).toBe(false);
    });

    test('Administrator can post Announcement', async ()  =>{
        expect(await ifCanPostAnnouncement(1)).toBe(true);
    });

    test('Citizen can perform Speed Test', async ()  =>{
        expect(await ifCanPostAnnouncement(1)).toBe(true);
    });
});
