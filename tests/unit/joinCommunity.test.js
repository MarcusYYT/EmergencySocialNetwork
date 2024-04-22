import { isUsernameValid, isPasswordValid, createNewUser } from "../../services/userService.js";
import DatabaseAdapter from '../../config/DatabaseAdapter.js'; 
import { sync as rimrafSync } from 'rimraf';

let database
beforeAll(async () => {
  DatabaseAdapter.setTestDatabaseName("thread_unit_db.sqlite")
  DatabaseAdapter.setCurrentDatabase('test')
  database = DatabaseAdapter.getDatabase()
  await database.authenticate();// Connect to the database
  await DatabaseAdapter.reinitializeModels();
});

afterAll(async () => {
  await database.close();// Disconnect from the database
  await new Promise(resolve => setTimeout(resolve, 1000));
  rimrafSync('./thread_unit_db.sqlite');
});

describe('Username should be at least 3 characters long', () => {
    test('Username with 4 characters should be true', async () => {
        expect(await isUsernameValid('abcd')).toBe(true);
    });
  
    test('Username with 2 characters should be false', async () => {
        expect(await isUsernameValid('ab')).not.toBe(true);
    });
  });
  
describe('Username should not in the banned username list', () => {
    test('Username not in banned list should be true', async () => {
        expect(await isUsernameValid('Carneige')).toBe(true);
    });
  
    test('Username in banned should be false', async () => {
        expect(await isUsernameValid('admin')).not.toBe(true);
    });
  });


describe('Password should be at least 4 characters long', () => {
    test('Password with 8 characters should be true', async () => {
        expect(await isPasswordValid('password')).toBe(true);
    });
  
    test('Password with 3 characters should be false', async() => {
        expect(await isPasswordValid('pwd')).not.toBe(true);
    });
  });

describe('Password should be at least 4 characters long', () => {
    test('Password with 4 characters should be true', async () => {
        expect(await isPasswordValid('pass')).toBe(true);
    });
  
    test('Password with 0 character should be false', async () => {
        expect(await isPasswordValid('')).not.toBe(true);
    });
  });

  describe('Username should not already exist in database', () => {

    test('Username is not in the database should be true', async () => {
      expect(await createNewUser('Mellon', 'password')).toMatchObject({
        success: true, 
        user_id: expect.any(Number), 
        message: "Create user successfully."
      });
    });
  
    test('Username is in the database should be false', async () => {
      expect(await createNewUser('Mellon', 'hihi')).toMatchObject({
        success: false, 
        user_id: expect.any(Number),
        message: "Username already exists."
      });
    });
  });
  