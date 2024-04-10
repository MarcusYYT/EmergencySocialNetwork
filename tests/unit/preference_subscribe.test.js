import DatabaseAdapter from '../../config/DatabaseAdapter.js';
import {sync as rimrafSync} from "rimraf";
import { Preference } from "../../models/Preference.model.js";
import { User } from "../../models/User.model.js";
import { Subscriber } from '../../models/Subscriber.model.js';
import { createNewUser, changeStatus } from "../../services/userService.js";
let database;

beforeAll(async () => {
    DatabaseAdapter.setTestDatabaseName("preference_unit_db.sqlite")
    DatabaseAdapter.setCurrentDatabase('test')
    database = DatabaseAdapter.getDatabase()
    await database.authenticate();// Connect to the database
    await DatabaseAdapter.reinitializeModels();
});

afterAll(async () => {
    await database.close();// Disconnect from the database
    await new Promise(resolve => setTimeout(resolve, 1000));
    rimrafSync('./preference_unit_db.sqlite');
});


describe('Set Preference', () => {

    test('Create 4 Users', async () => {
        expect(await createNewUser('User1', 'password')).toMatchObject({
            success: true,
            user_id: expect.any(Number),
            message: "Create user successfully."
        });
        expect(await createNewUser('User2', 'password')).toMatchObject({
            success: true,
            user_id: expect.any(Number),
            message: "Create user successfully."
        });

        await changeStatus(1, 'OK');
        await changeStatus(2, 'OK');
    });
    test("setPreferences creates preferences", async () => {
        // Create new preferences
        await Preference.setPreferences(1, "user1@example.com", "Ok", true, true, true, true);
        const preferences = await Preference.getPreferences(1);
        expect(preferences.email).toBe("user1@example.com");
        expect(preferences.email_notification_preference).toBe("Ok");
        expect(preferences.announcement_updates).toBe(true);
        expect(preferences.private_post_updates).toBe(true);
        expect(preferences.public_post_updates).toBe(true);
        expect(preferences.status_changes).toBe(true);
    });

    test("setPreferences updates preferences", async () => {
        // Update existing preferences
        await Preference.setPreferences(1, "user1_new@example.com", "Help", false, false, false, false);
        const updatedPreferences = await Preference.getPreferences(1);
        expect(updatedPreferences.email).toBe("user1_new@example.com");
        expect(updatedPreferences.email_notification_preference).toBe("Help");
        expect(updatedPreferences.announcement_updates).toBe(false);
        expect(updatedPreferences.private_post_updates).toBe(false);
        expect(updatedPreferences.public_post_updates).toBe(false);
        expect(updatedPreferences.status_changes).toBe(false);
    });

    test("getPreferences retrieves preferences", async () => {
        const preferences = await Preference.getPreferences(1);
        expect(preferences).toBeTruthy();
        expect(preferences.email).toBe("user1_new@example.com");
    });

    test("getUsersWithPreferenceEnabled returns users with enabled preference", async () => {
        await Preference.setPreferences(2, "user2@example.com", "Ok", false, true, false, false);

        const usersWithPrivatePostUpdates = await Preference.getUsersWithPreferenceEnabled("private_post_updates");
        expect(usersWithPrivatePostUpdates).toEqual(
            expect.arrayContaining([
                expect.objectContaining({ user_id: 2, email: "user2@example.com", username: "User2" })
            ])
        );
    });

    test("checkPrivatePostUpdatesPreference checks if a user should receive email notification for private post updates", async () => {
        const result = await Preference.checkPrivatePostUpdatesPreference(1);
        expect(result.shouldSend).toBe(false);
        expect(result.email).toBe(undefined);

        const user3 = await User.createUser("User3", "password3");
        await Preference.setPreferences(3, "user3@example.com", "Ok", false, true, false, false);
        await User.changeStatus(3, "help");

        const resultForUser3 = await Preference.checkPrivatePostUpdatesPreference(3);
        expect(resultForUser3.shouldSend).toBe(true);
        expect(resultForUser3.email).toBe("user3@example.com");
    });
    test('Add Subscriber', async () => {
        const userId = 1; 
        const subscriberId = 2; 
        const result = await Subscriber.addSubscriber(userId, subscriberId);
        expect(result).toBeTruthy(); 
    });

    test('Get Subscribers', async () => {
        const subscriberId = 2; 
        const subscribers = await Subscriber.getSubscribers(subscriberId);
        expect(subscribers).toHaveLength(1); 
        console.log(subscribers)
        expect(subscribers[0].master_id).toBe(1);
    });
    test('Get Subscribers With Details', async () => {
        const userId = 1; 
        const subscribers = await Subscriber.getSubscribersWithDetails(userId);
        expect(subscribers).toHaveLength(1); 
        expect(subscribers[0].user_id).toBe(2); 
    });
    
    test('Remove Subscriber', async () => {
        const userId = 1; 
        const subscriberId = 2; 
        const result = await Subscriber.removeSubscriber(userId, subscriberId);
        expect(result).toBeTruthy();
    });

    
    

    
});