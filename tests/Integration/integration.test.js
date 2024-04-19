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
    test('append status history', async () =>{
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

  test('no threads should exist after deleting', async () => {
    const getresponse = await supertest(app)
      .get(`/threads`);
    expect(getresponse.status).toBe(200);
    expect(getresponse.body.success).toBe(true);
    expect(getresponse.body.message).toBeDefined();
    expect(Array.isArray(getresponse.body.data)).toBe(true);
    expect(getresponse.body.data.length).toBe(0);
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
      .get(`/search?q=${searchValue}&domain=Threads&urgency=Filter`);
    expect(getresponse.status).toBe(200);
    expect(getresponse.body.success).toBe(true);
    expect(getresponse.body.message).toBeDefined();
    expect(Array.isArray(getresponse.body.data)).toBe(true);
    expect(getresponse.body.data.length).toBe(1);
  });

  test('search for threadPosts', async () => {
    const searchValue = "test"
    const thread_id = 2
    const getresponse = await supertest(app)
      .get(`/search?q=${searchValue}&domain=ThreadPosts&threadId=${thread_id}&urgency="Filter"`);
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


describe('Resouece Management tests', () => {
  let typeId;
  let unitId;

  // Pre-test setup to create necessary resource type and unit
  beforeAll(async () => {
      // Create resource type
      const typeResponse = await supertest(app)
          .post('/resource/addType')
          .send({ type_name: 'Water' });
      typeId = typeResponse.body.added_type_id;

      // Create resource unit
      const unitResponse = await supertest(app)
          .post('/resource/addUnit')
          .send({ unit_name: 'Gallons' });
      unitId = unitResponse.body.added_unit_id;
  });

  test('Get resource types successfully', async() => {
      const typeResponse = await supertest(app)
          .get('/resource/types');
      expect(typeResponse.statusCode).toBe(200);
      expect(typeResponse.body.success).toBe(true);
  });

  test('Get resource units successfully', async() => {
      const unitResponse = await supertest(app)
          .get('/resource/units');
      expect(unitResponse.statusCode).toBe(200);
      expect(unitResponse.body.success).toBe(true);
  });



  test('Create new resource successfully', async () => {
      const resourceResponse = await supertest(app)
          .post('/resource/post')
          .send({
              user_id: 1,
              resource_type_id: typeId,
              resource_name: 'Water',
              resource_amount: 100,
              resource_unit_id: unitId,
              resource_note: 'Urgently needed',
              latitude: 34.0522,
              longitude: -118.2437,
              tel: '123-456-7890'
          });
      expect(resourceResponse.statusCode).toBe(201);
      expect(resourceResponse.body.success).toBe(true);
      expect(resourceResponse.body.message).toBe('Post a new resource successful');
  });

  test('Fail to create resource with non-exist type or unit', async () =>{
      const resourceResponse = await supertest(app)
          .post('/resource/post')
          .send({
              user_id: 1,
              resource_type_id: 888,
              resource_name: 'Water',
              resource_amount: 100,
              resource_unit_id: 888,
              resource_note: 'Urgently needed',
              latitude: 34.0522,
              longitude: -118.2437,
              tel: '123-456-7890'
          });
      expect(resourceResponse.statusCode).toBe(500);
      expect(resourceResponse.body.success).toBe(undefined);
  });

  test('Successfully retrieve a resource by ID', async () => {
      const resourceResponse = await supertest(app)
          .get('/resource/get/1');
      expect(resourceResponse.statusCode).toBe(200);
      expect(resourceResponse.body.success).toBe(true);
  });

  test('Successfully retrieve a resource by User ID', async () => {
      const resourceResponse = await supertest(app)
          .get('/resource/list/1');
      expect(resourceResponse.statusCode).toBe(200);
      expect(resourceResponse.body.success).toBe(true);
  });

  test('Successfully get resources by a type', async () => {
      const resourceResponse = await supertest(app)
          .get(`/resource/type/${typeId}`);
      expect(resourceResponse.statusCode).toBe(200);
      expect(resourceResponse.body.success).toBe(true);
  });

  test('Failed to get resources by a non-existing type', async () => {
      const resourceResponse = await supertest(app)
          .get('/resource/type/999');
      expect(resourceResponse.statusCode).toBe(404);
      expect(resourceResponse.body.success).toBe(false);
  });

  test('Fail to retrieve a non-existent resource', async () => {
      const resourceResponse = await supertest(app)
          .get('/resource/get/999'); // Assuming 999 does not exist
      expect(resourceResponse.statusCode).toBe(404);
  });

  test('Update an existing resource', async () => {
      const resourceResponse = await supertest(app)
          .put('/resource/update')
          .send({
              resource_id: 1,
              user_id: 1,
              resource_type_id: typeId,
              resource_name: 'Updated Water',
              resource_amount: 150,
              resource_unit_id: unitId,
              resource_note: 'Urgently needed',
              latitude: 34.0522,
              longitude: -118.2437,
              tel: '123-456-7890'
          });
      expect(resourceResponse.statusCode).toBe(200);
      expect(resourceResponse.body.success).toBe(true);
  });

  test('Create one more resource ', async () => {
      const resourceResponse = await supertest(app)
          .post('/resource/post')
          .send({
              user_id: 1,
              resource_type_id: typeId,
              resource_name: 'food',
              resource_amount: 100,
              resource_unit_id: unitId,
              resource_note: 'Urgently needed',
              latitude: 34.0522,
              longitude: -118.2437,
              tel: '123-456-7890'
          });
      expect(resourceResponse.statusCode).toBe(201);
      expect(resourceResponse.body.success).toBe(true);
      expect(resourceResponse.body.message).toBe('Post a new resource successful');
  });

  test('Successfully get grouped resources', async () => {
      const resourceResponse = await supertest(app)
          .get('/resource/grouped');
      expect(resourceResponse.statusCode).toBe(200);
      expect(resourceResponse.body.success).toBe(true);
  });

  test('Successfully get resources list', async () => {
      const resourceResponse = await supertest(app)
          .get('/resource/list');
      expect(resourceResponse.statusCode).toBe(200);
      expect(resourceResponse.body.success).toBe(true);
  });

  test('Delete a resource', async () => {
      const resourceResponse = await supertest(app)
          .delete('/resource/delete/1');
      expect(resourceResponse.statusCode).toBe(200);
      expect(resourceResponse.body.success).toBe(true);
  });

  // Handle a non-existent resource scenario
  test('Fail to update a non-existent resource', async () => {
      const resourceResponse = await supertest(app)
          .put('/resource/update/9999') // Assuming 9999 is a non-existent ID
          .send({
              resource_name: 'Phantom Water',
              resource_amount: 50,
              resource_unit_id: unitId,
              resource_note: 'Not really here',
              latitude: 0,
              longitude: 0,
              tel: '000-000-0000'
          });
      expect(resourceResponse.statusCode).toBe(404);
  });

});