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



describe('Post Thread Test', () => {

  test('get Thread list before any thread is made', async () => {
    const getresponse = await supertest(app)
      .get(`/threads`);
    expect(getresponse.status).toBe(200);
    expect(getresponse.body.success).toBe(true);
    expect(getresponse.body.message).toBeDefined();
    expect(Array.isArray(getresponse.body.data)).toBe(true);
    expect(getresponse.body.data.length).toBe(0);
  });

  test('post a thread', async () => {
    const postResponse = await supertest(app)
      .post(`/threads`)
      .send({
        creator_id: 1,
        thread_name: "test",
        urgency: "High Priority",
        tags: ["Info"]
      });
      expect(postResponse.statusCode).toBe(201);
      expect(postResponse.body).toEqual({
        success: true,
        message: 'Posting a new thread is successful'
      });
    });

  test('get thread list for after a post', async () => {
    const getresponse = await supertest(app)
      .get(`/threads`);
    expect(getresponse.status).toBe(200);
    expect(getresponse.body.success).toBe(true);
    expect(getresponse.body.message).toBeDefined();
    expect(Array.isArray(getresponse.body.data)).toBe(true);
    expect(getresponse.body.data[0].thread_name).toBe('test');
  });

  test('edit a thread', async () => {
    const postResponse = await supertest(app)
      .put(`/threads/1`)
      .send({
        thread_id: 1,
        thread_name: "test1",
        urgency: "Low Priority",
        tags: ["Info", "Volunteering"]
      });
      expect(postResponse.statusCode).toBe(200);
      expect(postResponse.body).toEqual({
        success: true,
        message: 'Edit thread list successful'
      });
  });
  
  test('you should be able to see the change', async () => {
    const getresponse = await supertest(app)
      .get(`/threads`);
    expect(getresponse.status).toBe(200);
    expect(getresponse.body.success).toBe(true);
    expect(getresponse.body.message).toBeDefined();
    expect(Array.isArray(getresponse.body.data)).toBe(true);
    expect(getresponse.body.data[0].thread_name).toBe('test1');
    expect(getresponse.body.data[0].urgency).toBe('Low Priority');
    expect(getresponse.body.data[0].tags).toStrictEqual(["Info", "Volunteering"]);
  });
  
  test('delete a thread', async () => {
    const postResponse = await supertest(app)
      .delete(`/threads/1`)
      .send({
        thread_id: 1
      });
      expect(postResponse.statusCode).toBe(200);
      expect(postResponse.body).toEqual({
        message: 'Delete thread list successful'
      });
  });
});

describe('Post a Thread Post Test', () => {

  test('post a thread', async () => {
    const postResponse = await supertest(app)
      .post(`/threads`)
      .send({
        creator_id: 1,
        thread_name: "test",
        urgency: "High Priority",
        tags: ["Info"]
      });
      expect(postResponse.statusCode).toBe(201);
      expect(postResponse.body).toEqual({
        success: true,
        message: 'Posting a new thread is successful'
      });
    });

  test('get Thread Post list before any threadPost is made', async () => {
    const getresponse = await supertest(app)
    .get(`/threadPosts/2`);
    expect(getresponse.status).toBe(200);
    expect(getresponse.body.success).toBe(true);
    expect(getresponse.body.message).toBeDefined();
    expect(Array.isArray(getresponse.body.data)).toBe(true);
    expect(getresponse.body.data.length).toBe(0);
  });
  
  test('get thread list for after a post', async () => {
    const getresponse = await supertest(app)
      .get(`/threads`);
    expect(getresponse.status).toBe(200);
    expect(getresponse.body.success).toBe(true);
    expect(getresponse.body.message).toBeDefined();
    expect(Array.isArray(getresponse.body.data)).toBe(true);
    expect(getresponse.body.data[0].thread_name).toBe('test');
    expect(getresponse.body.data[0].thread_id).toBe(2);
  });

  test('post a thread post', async () => {
    const postResponse = await supertest(app)
      .post(`/threadPosts/2`)
      .send({
        user_id: 1,
        content: "test", 
        status: "emergency",
        thread_id: 2
      });
      expect(postResponse.statusCode).toBe(201);
      expect(postResponse.body).toEqual({
        success: true,
        message: 'ThreadPost a new post successful'
      });
    });

    test('get thread post list for after a post', async () => {
    const getresponse = await supertest(app)
      .get(`/threadPosts/2`);
    expect(getresponse.status).toBe(200);
    expect(getresponse.body.success).toBe(true);
    expect(getresponse.body.message).toBeDefined();
    expect(Array.isArray(getresponse.body.data)).toBe(true);
    expect(getresponse.body.data.length).toBe(1);
    expect(getresponse.body.data[0].content).toBe("test");
    expect(getresponse.body.data[0].status).toBe("emergency");
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

  test('search a thread', async () => {
    const searchValue = "test"
    const getresponse = await supertest(app)
      .get(`/search?q=${searchValue}&domain=Threads`);
    expect(getresponse.status).toBe(200);
    expect(getresponse.body.success).toBe(true);
    expect(getresponse.body.message).toBeDefined();
    expect(Array.isArray(getresponse.body.data)).toBe(true);
    expect(getresponse.body.data.length).toBe(1);
  });

  test('search a thread', async () => {
    const searchValue = "test"
    const thread_id = 2
    const getresponse = await supertest(app)
      .get(`/search?q=${searchValue}&domain=ThreadPosts&threadId=${thread_id}`);
    expect(getresponse.status).toBe(200);
    expect(getresponse.body.success).toBe(true);
    expect(getresponse.body.message).toBeDefined();
    expect(Array.isArray(getresponse.body.data)).toBe(true);
    expect(getresponse.body.data.length).toBe(1);
  });
});
