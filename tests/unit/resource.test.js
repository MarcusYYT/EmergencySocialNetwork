import {createNewResource, getResourceTypes, getResourceUnits} from "../../services/resourceService.js";
import {getResourceById} from "../../services/resourceService.js";
import {getResourcePosts} from "../../services/resourceService.js";
import {getResourceGrouped} from "../../services/resourceService.js";
import {updateResource} from "../../services/resourceService.js";
import {addResourceType} from "../../services/resourceService.js";
import {addResourceUnit} from "../../services/resourceService.js";
import DatabaseAdapter from '../../config/DatabaseAdapter.js';
import {sync as rimrafSync} from "rimraf";
import { createNewUser } from "../../services/userService.js";

let database
beforeAll(async () => {
    DatabaseAdapter.setTestDatabaseName('./resource_db.sqlite'); // Create a new instance of the database
    await DatabaseAdapter.setCurrentDatabase('test') // Connect to the database
    database = DatabaseAdapter.getDatabase()
    await database.authenticate();// Connect to the database
    await DatabaseAdapter.reinitializeModels();
});

afterAll(async () => {
    await database.close()// Disconnect from the database
    await new Promise(resolve => setTimeout(resolve, 1000));
    rimrafSync('./resource_db.sqlite');
});

describe('Create new resource type and unit', () => {

    test('Create Users', async () => {
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

    test('Create type', async () => {
        expect(await addResourceType('Medication')).toMatchObject({
            message: "Add resource type successful"
        });
        expect(await addResourceType('Medication')).toMatchObject({
            message: "Resource type already exists"
        });
        expect(await addResourceType('Water')).toMatchObject({
            message: "Add resource type successful"
        });
    });

    test('Create unit', async () => {
        expect(await addResourceUnit('piece')).toMatchObject({
            message: "Add resource unit successful"
        });
        expect(await addResourceUnit('piece')).toMatchObject({
            message: "Resource unit already exists"
        });
        expect(await addResourceUnit('bottle')).toMatchObject({
            message: "Add resource unit successful"
        });
    });

    test('get units', async () => {
        expect(await getResourceUnits()).toMatchObject({
            data: [
                {
                    id: expect.any(Number),
                    name: "piece",
                    createdAt: expect.anything(),
                    updatedAt: expect.anything()
                },
                {
                    id: expect.any(Number),
                    name: "bottle",
                    createdAt: expect.anything(),
                    updatedAt: expect.anything()
                }
            ]
        });
    });

    test('get types', async () => {
        expect(await getResourceTypes()).toMatchObject({
            data: [
                {
                    id: expect.any(Number),
                    name: "Medication",
                    createdAt: expect.anything(),
                    updatedAt: expect.anything()
                },
                {
                    id: expect.any(Number),
                    name: "Water",
                    createdAt: expect.anything(),
                    updatedAt: expect.anything()
                }
            ]
        });
    });

    test('Create new resource', async () => {
        expect(await createNewResource(1, 1, 'Medication', 5, 1, 'note', 1, 1)).toMatchObject({
            createdAt: expect.anything(),
            resource_amount: 5,
            resource_id: expect.any(Number),
            resource_name: "Medication",
            resource_type_id: 1,
            resource_unit_id: 1,
            updatedAt: expect.anything(),
            user_id: 1,
            resource_latitude: 1,
            resource_longitude: 1,
            resource_note: "note"
        });
    });

    test('Get resource', async () => {
        expect(await getResourcePosts()).toMatchObject({
            data: [
                {
                    createdAt: expect.anything(),
                    resource_amount: 5,
                    resource_id: expect.any(Number),
                    resource_name: "Medication",
                    resource_type_id: 1,
                    resource_unit_id: 1,
                    updatedAt: expect.anything(),
                    user_id: 1,
                    resource_latitude: 1,
                    resource_longitude: 1,
                    resource_note: "note",
                    resource_type: expect.anything(),
                    resource_unit: expect.anything()
                }
            ]
        });
    });

    test('Update resource', async () => {
        expect(await updateResource(1, 1, 'Medication', 10, 1, 'note', 1, 1)).toMatchObject({
            data: [
                1
            ],
            message: "Update resource successful"
        });
    });

    test('Delete resource', async () => {
        expect(await getResourceById(1)).toMatchObject({
            data: [
                {
                    createdAt: expect.anything(),
                    resource_amount: 10,
                    resource_id: 1,
                    resource_name: "Medication",
                    resource_type_id: 1,
                    resource_unit_id: 1,
                    updatedAt: expect.anything(),
                    user_id: 1,
                    resource_latitude: 1,
                    resource_longitude: 1,
                    resource_note: "note"
                }
            ],
            exist: true
        });
    });
});




    // test('Search n', async () => {
    //     expect(await searchUser("n")).toMatchObject({
    //         success: true,
    //         data:  [
    //                   {
    //                "createdAt": expect.anything(),
    //                    "online_status": "online",
    //                    "password": expect.anything(),
    //                    "status": "place_holder",
    //                    "updatedAt": expect.anything(),
    //                    "user_id": expect.any(Number),
    //                    "username": "Justin",
    //                  },
    //           {
    //                "createdAt": expect.anything(),
    //                    "online_status": "online",
    //                   "password": expect.anything(),
    //                   "status": "place_holder",
    //                    "updatedAt": expect.anything(),
    //                    "user_id": expect.any(Number),
    //                    "username": "Hakan",
    //                  },
    //        ],
    //     });
    // });