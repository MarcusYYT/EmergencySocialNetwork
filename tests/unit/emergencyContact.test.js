import { createEmergencyContact, getEmergencyContactByUserId, changePrimaryContact, changeAlternativeContact, changeEmergencyMessage, changeLocationPermission, changeLocationLink} from "../../services/emergencyContactService.js";
import { createNewUser } from "../../services/userService.js";
import { EmergencyContact } from "../../models/EmergencyContact.model.js";
import DatabaseAdapter from '../../config/DatabaseAdapter.js'; 
import { sync as rimrafSync } from 'rimraf';

let database;

beforeAll(async () => {
    DatabaseAdapter.setTestDatabaseName("emergency_contact_db.sqlite")
    DatabaseAdapter.setCurrentDatabase('test')
    database = DatabaseAdapter.getDatabase()
    await database.authenticate();// Connect to the database
    await DatabaseAdapter.reinitializeModels();
});

afterAll(async () => {
    await database.close();// Disconnect from the database
    await new Promise(resolve => setTimeout(resolve, 1000));
    rimrafSync('./emergency_contact_db.sqlite');
});

describe('Create Users first before creating the user emergency contact', () => {
    
    test('Create Users', async () => {
        expect(await createNewUser('userOne', 'password')).toMatchObject({
            success: true,
            user_id: expect.any(Number),
            message: "Create user successfully."
        });
        expect(await createNewUser('userTwo', 'password')).toMatchObject({
            success: true,
            user_id: expect.any(Number),
            message: "Create user successfully."
        });
        expect(await createNewUser('userThree', 'password')).toMatchObject({
            success: true,
            user_id: expect.any(Number),
            message: "Create user successfully."
        });
        expect(await createNewUser('userFour', 'password')).toMatchObject({
            success: true,
            user_id: expect.any(Number),
            message: "Create user successfully."
        });
        expect(await createNewUser('userFive', 'password')).toMatchObject({
            success: true,
            user_id: expect.any(Number),
            message: "Create user successfully."
        });
    });
})

describe('Only allow users and emergency contacts that are already in User table to create emergency contact', () => {
    
    test('Create User emergency contact with registered user', async () => {
        expect(await createEmergencyContact(1, 2, 3, "Hellow")).toMatchObject({
            success: true,
            emergency_id: expect.any(Number),
            message: "Create emergency contact successfully."
        });
    });

    test('Create User emergency contact with unregistered user', async () => {
        expect(await createEmergencyContact(-1, 1, 2, "HELP!")).not.toMatchObject({
            success: true,
            emergency_id: expect.any(Number),
            message: "Create emergency contact successfully"
        });
    });

    test('Create User emergency contact with unregistered emergency contacts', async () => {
        expect(await createEmergencyContact(5, 10, 20, "HELP!")).not.toMatchObject({
            success: true,
            emergency_id: expect.any(Number),
            message: "Create emergency contact successfully"
        });
    });
})

describe('User id is required, but primary contact id, alternative id, and message are optional for creation', () => {
    
    test('Creation will fail without user id', async () => {
        const result = await createEmergencyContact(null, 2, 3, "I need help!");
        expect(result).toMatchObject({
        success: false,
        message: "An unexpected error occurred."
        });
    });

    test('Creation will success without primary contact id', async () => {
        const result = await createEmergencyContact(2, null, 3, "I need help!");
        expect(result).toMatchObject({
        success: true,
        message: "Create emergency contact successfully."
        });
    });

    test('Creation will success without alternative contact id', async () => {
        const result = await createEmergencyContact(3, 2, null, "I need help!");
        expect(result).toMatchObject({
        success: true,
        message: "Create emergency contact successfully."
        });
    });

    test('Creation will success without emergency message', async () => {
        const result = await createEmergencyContact(4, 2, 3);
        expect(result).toMatchObject({
        success: true,
        message: "Create emergency contact successfully."
        });
    });
})

describe('Check if a given user id exists', () => {

    test('If given user id exists', async () => {
        const result = await getEmergencyContactByUserId(1);
        expect(result).toMatchObject({
            exist: true
        });
    });

    test('If given user id does not exist', async () => {
        expect(await EmergencyContact.getEmergencyContactByUserId(-1)).not.toBe(true);
    });
})

describe('Change contact information', () => {

    test('Change primary contact with existing user', async () => {
        const result = await changePrimaryContact(1, 5);
        expect(result).toMatchObject({
            success: true
        });
    });

    test('Change alternative contact with existing user', async () => {
        const result = await changeAlternativeContact(1, 4);
        expect(result).toMatchObject({
            success: true
        });
    });

    test('Change emergency message with existing user', async () => {
        const result = await changeEmergencyMessage(1, "Demo is tomorrow! T T");
        expect(result).toMatchObject({
            success: true
        });
    });

    test('Change location permission with existing user', async () => {
        const result = await changeLocationPermission(1, "no");
        expect(result).toMatchObject({
            success: true
        });
    });

    test('Change location link with existing user', async () => {
        const result = await changeLocationLink(1, "https://www.google.com/maps");
        expect(result).toMatchObject({
            success: true
        });
    });
})