import supertest from 'supertest';
import app from '../../app.js'; 
import { sync as rimrafSync } from 'rimraf';
import DatabaseAdapter from '../../config/DatabaseAdapter.js';


let server;
let database;

beforeAll(async () => {
  server = app.listen(0); // Start the app on a different port for testing
  DatabaseAdapter.setTestDatabaseName("integration_db.sqlite")
  DatabaseAdapter.setCurrentDatabase('test')
  database = DatabaseAdapter.getDatabase()
  await database.authenticate();// Connect to the database
  await DatabaseAdapter.reinitializeModels();
});

afterAll(async () => {
  await database.close();// Disconnect from the database
  await new Promise((resolve) => server.close(resolve)); // Stop the server
  rimrafSync('./integration_db.sqlite');
});

describe('status update tests', () => {

  test('Register the status of the user', async () => {
    const regResponse = await supertest(app)
      .post('/auth/register')
      .send({ username: 'testuser', password: 'testpass' });

    let userId = regResponse.body.user_id;
    console.log(`new user Id is ${userId} `)
    expect(regResponse.statusCode).toBe(201);
    expect(regResponse.body.success).toBe(true);

    })

  test('change status', async () =>{
      const statusResponse = await supertest(app)
      .put(`/users/1`)
      .send({
        user_id: 1,
        updateAt: "status",
        updateValue: "OK"
      });
    expect(statusResponse.statusCode).toBe(200);
    expect(statusResponse.body.success).toBe(true);
    });
  test('apeend status history', async () =>{
      const statusResponse = await supertest(app)
      .post(`/status`)
      .send({
        user_id: 1, 
        status: "OK"
      });
    expect(statusResponse.statusCode).toBe(201);
    expect(statusResponse.body.success).toBe(true);
    });

    test('get status change history', async () =>{
      const getHistryResponse = await supertest(app)
      .get(`/status/1`);
    expect(getHistryResponse.statusCode).toBe(200);
    expect(getHistryResponse.body.success).toBe(true);
    expect(getHistryResponse.body.data.length).toBe(1);
    expect(getHistryResponse.body.data[0].status).toBe('OK');
    });
  });

describe('Private Chat Test', () => {
  test('Register another new user', async () =>{
    const regResponse = await supertest(app)
      .post('/auth/register')
      .send({ username: 'testuser2', password: 'testpass' });
    expect(regResponse.statusCode).toBe(201);
    expect(regResponse.body.success).toBe(true);
  });

  test('get Private Post list for a user pair before any message sent', async () => {
    const getresponse = await supertest(app)
      .get(`/privatePosts/2/1`);
    expect(getresponse.status).toBe(200);
    expect(getresponse.body.success).toBe(true);
    expect(getresponse.body.message).toBeDefined();
    expect(Array.isArray(getresponse.body.data)).toBe(true);
    expect(getresponse.body.data.length).toBe(0);
  });
  test('Sent a Private Post', async () => {
    const postResponse = await supertest(app)
      .post(`/privatePosts`)
      .send({
        sender_name: 'testuser2',
        sender_id: 2, 
        receiver_id: 1,
        status: "OK",
        dateTime: new Date().toLocaleString(),
        content: "Hello"
      });
      expect(postResponse.statusCode).toBe(201);
      expect(postResponse.body).toEqual({
        success: true,
        message: 'Post a new post successful'
      });
    });

    test('get Private Post list for a user pair after message sent', async () => {
    const getresponse = await supertest(app)
      .get(`/privatePosts/2/1`);
    expect(getresponse.status).toBe(200);
    expect(getresponse.body.success).toBe(true);
    expect(getresponse.body.message).toBeDefined();
    expect(Array.isArray(getresponse.body.data)).toBe(true);
    expect(getresponse.body.data[0].content).toBe('Hello');
  });
});

describe('Post Announcement Test', () => {

  test('get Announcement list before any message sent', async () => {
    const getresponse = await supertest(app)
      .get(`/announcements`);
    expect(getresponse.status).toBe(200);
    expect(getresponse.body.success).toBe(true);
    expect(getresponse.body.message).toBeDefined();
    expect(Array.isArray(getresponse.body.data)).toBe(true);
    expect(getresponse.body.data.length).toBe(0);
  });

  test('post a announcement', async () => {
    const postResponse = await supertest(app)
      .post(`/announcements`)
      .send({
        username: "testuser",
        user_id: 1,
        dateTime: new Date().toLocaleString(),
        content: "test"
      });
      expect(postResponse.statusCode).toBe(201);
      expect(postResponse.body).toEqual({
        success: true,
        message: 'Post a new announcement successful'
      });
    });

    test('get announcement list for after a post', async () => {
    const getresponse = await supertest(app)
      .get(`/announcements`);
    expect(getresponse.status).toBe(200);
    expect(getresponse.body.success).toBe(true);
    expect(getresponse.body.message).toBeDefined();
    expect(Array.isArray(getresponse.body.data)).toBe(true);
    expect(getresponse.body.data[0].content).toBe('test');
  });
});

describe('search Test', () => {

  test('search a user', async () => {
    const searchValue = "test"
    const getresponse = await supertest(app)
      .get(`/search?q=${searchValue}&domain=User`);
    expect(getresponse.status).toBe(200);
    expect(getresponse.body.success).toBe(true);
    expect(getresponse.body.message).toBeDefined();
    expect(Array.isArray(getresponse.body.data)).toBe(true);
    expect(getresponse.body.data.length).toBe(2);
  });

  test('search a announcements', async () => {
    const searchValue = "test"
    const getresponse = await supertest(app)
      .get(`/search?q=${searchValue}&domain=Announcements`);
    expect(getresponse.status).toBe(200);
    expect(getresponse.body.success).toBe(true);
    expect(getresponse.body.message).toBeDefined();
    expect(Array.isArray(getresponse.body.data)).toBe(true);
    expect(getresponse.body.data.length).toBe(1);
    });

    test('search a private post', async () => {
      const searchValue = "Hello"
      const senderId = 2;
      const receiverId = 1;
      const getresponse = await supertest(app)
        .get(`/search?q=${searchValue}&domain=PrivatePosts&senderId=${senderId}&receiverId=${receiverId}`);
      expect(getresponse.status).toBe(200);
      expect(getresponse.body.success).toBe(true);
      expect(getresponse.body.message).toBeDefined();
      expect(Array.isArray(getresponse.body.data)).toBe(true);
      expect(getresponse.body.data.length).toBe(1);
  });
});

describe('emergency contact tests', () => {

  test('Create new emergency contact successfully with given user for the first time', async () =>{
      const emergencyContactResponse = await supertest(app)
      .post(`/emergencyContacts`)
      .send({
        user_id: 1,
        primary_id: 1,
        alternative_id: 2,
        emergency_message: 'I need HELP!!!'
      });
      expect(emergencyContactResponse.statusCode).toBe(201);
      expect(emergencyContactResponse.body.success).toBe(true);
  });

  test('Fail to create new emergency contact with given user for the second time', async () =>{
      const emergencyContactResponse = await supertest(app)
      .post(`/emergencyContacts`)
      .send({
        user_id: 1,
        primary_id: 3,
        alternative_id: 4,
        emergency_message: 'I need HELP!!!'
      });
      expect(emergencyContactResponse.statusCode).toBe(409);
      expect(emergencyContactResponse.body.success).toBe(false);
  });

  test('Successfully get emergency contact with exist user id', async () =>{
    const emergencyContactResponse = await supertest(app)
    .get(`/emergencyContacts/1`);
    expect(emergencyContactResponse.statusCode).toBe(200);
    expect(emergencyContactResponse.body.success).toBe(true);
  });

  test('Fail to get emergency contacts socket id', async () =>{
    const emergencyContactResponse = await supertest(app)
    .get(`/emergencyContacts/1/2`);
    const numOfId = Object.keys(emergencyContactResponse.body.data).length
    expect(emergencyContactResponse.statusCode).toBe(200);
    // two socket ids are returned
    expect(numOfId).toBe(2);
    expect(emergencyContactResponse.body.success).toBe(true);
  });

  test('Update primary contact with given user id', async () =>{
    const emergencyContactResponse = await supertest(app)
    .put(`/emergencyContacts/1`)
    .send({
        user_id: 1,
        updateAt: "primary_contact_id",
        updateValue: 'testuser',
        updateId: 2
    });
    expect(emergencyContactResponse.statusCode).toBe(200);
    expect(emergencyContactResponse.body.success).toBe(true);
  });

  test('Update alternative contact of given user id with unregistered user', async () =>{
    const emergencyContactResponse = await supertest(app)
    .put(`/emergencyContacts/1`)
    .send({
        user_id: 1,
        updateAt: "alternative_contact_id",
        updateValue: 'Unregistered user',
        updateId: 3
    });
    expect(emergencyContactResponse.statusCode).toBe(404);
    expect(emergencyContactResponse.body.success).toBe(false);
  });

  test('Update emergency message with given user id', async () =>{
    const emergencyContactResponse = await supertest(app)
    .put(`/emergencyContacts/1`)
    .send({
        user_id: 1,
        updateAt: "emergency_message",
        updateValue: 'I am so tired'
    });
    expect(emergencyContactResponse.statusCode).toBe(200);
    expect(emergencyContactResponse.body.success).toBe(true);
  });

  test('Update location permission with given user id', async () =>{
    const emergencyContactResponse = await supertest(app)
    .put(`/emergencyContacts/1`)
    .send({
        user_id: 1,
        updateAt: "location_allow",
        updateValue: 'no'
    });
    expect(emergencyContactResponse.statusCode).toBe(200);
    expect(emergencyContactResponse.body.success).toBe(true);
  });

  test('Update location link with given user id', async () =>{
    const emergencyContactResponse = await supertest(app)
    .put(`/emergencyContacts/1`)
    .send({
        user_id: 1,
        updateAt: "location_link",
        updateValue: ''
    });
    expect(emergencyContactResponse.statusCode).toBe(200);
    expect(emergencyContactResponse.body.success).toBe(true);
  });


});