import supertest from 'supertest';
import app from '../../app.js'; 
import { sync as rimrafSync } from 'rimraf';
import DatabaseAdapter from '../../config/DatabaseAdapter.js';
import {User} from '../../models/User.model.js'
import {Post} from '../../models/Post.model.js'
import {PrivatePost} from '../../models/PrivatePost.model.js'
import {Status} from '../../models/Status.model.js'

let server;
let database;

beforeAll(async () => {
  server = app.listen(4000); // Start the app on a different port for testing
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