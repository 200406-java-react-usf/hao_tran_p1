import { UserService } from '../services/user-service';
import { UserRepository } from '../repos/user-repo';
import { User } from '../models/user';
import Validator from '../util/validator';
import { 
    ResourceNotFoundError, 
    BadRequestError, 
    AuthenticationError, 
    ResourcePersistenceError,
    NotImplementedError } from '../errors/errors';

jest.mock('../repos/user-repo', () => {

    return new class UserRepository {
        getAll = jest.fn();
        getById = jest.fn();
        getUserByUniqueKey = jest.fn();
        getUserByCredentials = jest.fn();
        save = jest.fn();
        update = jest.fn();
        deleteById = jest.fn();
    }

});
describe('userService', () => {

    let sut: UserService;
    let mockRepo;

    let mockUsers = [
        new User(1, 'aanderson', 'password', 'Alice', 'Anderson', 'aanderson@revature.com', 'Admin'),
        new User(2, 'bbailey', 'password', 'Bob', 'Bailey', 'bbailey@revature.com', 'User'),
        new User(3, 'ccountryman', 'password', 'Charlie', 'Countryman', 'ccountryman@revature.com', 'User'),
        new User(4, 'ddavis', 'password', 'Daniel', 'Davis', 'ddavis@revature.com', 'User'),
        new User(5, 'eeinstein', 'password', 'Emily', 'Einstein', 'eeinstein@revature.com', 'User')
    ];

    beforeEach(() => {

        mockRepo = jest.fn(() => {
            return {
                getAll: jest.fn(),
                getById: jest.fn(),
                getUserByUniqueKey: jest.fn(),
                getUserByCredentials: jest.fn(),
                save: jest.fn(),
                update: jest.fn(),
                deleteById: jest.fn()
            }
        });

        // @ts-ignore
        sut = new UserService(mockRepo);

    });

    test('should resolve to User[] (without passwords) when getAllUsers() successfully retrieves users from the data source', async () => {

        // Arrange
        expect.hasAssertions();
        mockRepo.getAll = jest.fn().mockReturnValue(mockUsers);

        // Act
        let result = await sut.getAllUsers();

        // Assert
        expect(result).toBeTruthy();
        expect(result.length).toBe(5);
        result.forEach(val => expect(val.password).toBeUndefined());

    });

    test('should reject with ResourceNotFoundError when getAllUsers fails to get any users from the data source', async () => {

        // Arrange
        expect.assertions(1);
        mockRepo.getAll = jest.fn().mockReturnValue([]);

        // Act
        try {
            await sut.getAllUsers();
        } catch (e) {

            // Assert
            expect(e instanceof ResourceNotFoundError).toBe(true);
        }

    });

    test('should resolve to User when getUserById is given a valid an known id', async () => {

        // Arrange
        expect.assertions(3);

        Validator.isValidId = jest.fn().mockReturnValue(true);

        mockRepo.getById = jest.fn().mockImplementation((id: number) => {
            return new Promise<User>((resolve) => resolve(mockUsers[id - 1]));
        });


        // Act
        let result = await sut.getUserById(1);

        // Assert
        expect(result).toBeTruthy();
        expect(result.ers_user_id).toBe(1);
        expect(result.password).toBeUndefined();

    });

    test('should reject with BadRequestError when getUserById is given a invalid value as an id (decimal)', async () => {

        // Arrange
        expect.hasAssertions();
        mockRepo.getById = jest.fn().mockReturnValue(false);

        // Act
        try {
            await sut.getUserById(3.14);
        } catch (e) {

            // Assert
            expect(e instanceof BadRequestError).toBe(true);
        }

    });

    test('should reject with BadRequestError when getUserById is given a invalid value as an id (zero)', async () => {

        // Arrange
        expect.hasAssertions();
        mockRepo.getById = jest.fn().mockReturnValue(false);

        // Act
        try {
            await sut.getUserById(0);
        } catch (e) {

            // Assert
            expect(e instanceof BadRequestError).toBe(true);
        }

    });

    test('should reject with BadRequestError when getUserById is given a invalid value as an id (NaN)', async () => {

        // Arrange
        expect.hasAssertions();
        mockRepo.getById = jest.fn().mockReturnValue(false);

        // Act
        try {
            await sut.getUserById(NaN);
        } catch (e) {

            // Assert
            expect(e instanceof BadRequestError).toBe(true);
        }

    });

    test('should reject with BadRequestError when getUserById is given a invalid value as an id (negative)', async () => {

        // Arrange
        expect.hasAssertions();
        mockRepo.getById = jest.fn().mockReturnValue(false);

        // Act
        try {
            await sut.getUserById(-2);
        } catch (e) {

            // Assert
            expect(e instanceof BadRequestError).toBe(true);
        }

    });

    test('should reject with ResourceNotFoundError if getByid is given an unknown id', async () => {

        // Arrange
        expect.hasAssertions();
        mockRepo.getById = jest.fn().mockReturnValue(true);

        // Act
        try {
            await sut.getUserById(9999);
        } catch (e) {

            // Assert
            expect(e instanceof ResourceNotFoundError).toBe(true);
        }

    });

    test('should resolve to User when getUserByUniqueKey is given a valid an known key(username)', async () => {

        // Arrange
        expect.assertions(3);

        Validator.isValidId = jest.fn().mockReturnValue(true);

        mockRepo.getById = jest.fn().mockImplementation((id: number) => {
            return new Promise<User>((resolve) => resolve(mockUsers[id - 1]));
        });

        // Act
        let query = {
            username: 'aanderson'
        }
        let result = await sut.getUserByUniqueKey(query);

        // Assert
        expect(result).toBeTruthy();
        expect(result.ers_user_id).toBe(1);
        expect(result.password).toBeUndefined();

    });
    test('should reject with BadRequestError if invalid key', async () => {

        // Arrange
        expect.hasAssertions();
        mockRepo.getById = jest.fn().mockReturnValue(true);

        // Act
        let query = {
            test: 'aanderson'
        }
        try {
            await sut.getUserByUniqueKey(query);
        } catch (e) {

            // Assert
            expect(e instanceof BadRequestError).toBe(true);
        }

    });
    test('should reject with BadRequestError if repo return false', async () => {

        // Arrange
        expect.hasAssertions();
        mockRepo.getById = jest.fn().mockReturnValue(false);

        // Act
        let query = {
            username: 'aanderson'
        }
        try {
            await sut.getUserByUniqueKey(query);
        } catch (e) {

            // Assert
            expect(e instanceof BadRequestError).toBe(true);
        }

    });
    test('should reject with BadRequestError if valid key but no result', async () => {

        // Arrange
        expect.hasAssertions();
        mockRepo.getUserByCredentials = jest.fn().mockReturnValue(mockUsers[0]);

        // Act
        let query = {
            username: 'test'
        }
        try {
            await sut.getUserByUniqueKey(query);
        } catch (e) {

            // Assert
            expect(e instanceof ResourceNotFoundError).toBe(true);
        }


    });
    test('should resolve to User when authenticateUser is given a valid un, pw', async () => {
        // Arrange
        expect.assertions(3);

        Validator.isValidId = jest.fn().mockReturnValue(true);

        mockRepo.getUserByCredentials = jest.fn().mockImplementation((id: number) => {
            return new Promise<User>((resolve) => resolve(mockUsers[0]));
        });

        // Act
        let result = await sut.authenticateUser('test', 'test');

        // Assert
        expect(result).toBeTruthy();
        expect(result.ers_user_id).toBe(1);
        expect(result.password).toBeUndefined();
    });
    test('should reject with BadRequestError to User when authenticateUser is given a invalid un, pw', async () => {
        // Arrange
        expect.assertions(3);

        Validator.isValidId = jest.fn().mockReturnValue(false);

        mockRepo.getUserByCredentials = jest.fn().mockReturnValue(mockUsers[0]);

        // Act
        try {
            await sut.authenticateUser('test', 'test');
        } catch (e) {

            // Assert
            expect(e instanceof BadRequestError).toBe(true);
        }
    });
    test('should reject with AuthError User when authenticateUser if cannot find user', async () => {
        // Arrange
        expect.assertions(3);

        Validator.isValidId = jest.fn().mockReturnValue(false);
        mockRepo.getUserByCredentials = jest.fn().mockReturnValue({});

        // Act
        try {
            await sut.authenticateUser('test', 'test');
        } catch (e) {

            // Assert
            expect(e instanceof AuthenticationError).toBe(true);
        }
    });
    test('should resolve to User when addNewUser', async () => {
        // Arrange
        expect.assertions(3);

        Validator.isValidId = jest.fn().mockReturnValue(true);
        Validator.isValidObject = jest.fn().mockReturnValue(true);
        mockRepo.isUsernameAvailable = jest.fn().mockReturnValue(true);
        mockRepo.isEmailAvailable = jest.fn().mockReturnValue(true);
        mockRepo.save =  jest.fn().mockReturnValue(mockUsers[5]);

        // Act
        let newUser = new User(6, 'test', 'password', 'test', 'test', 'test@revature.com', 'User')
        let result = await sut.addNewUser(newUser);

        // Assert
        expect(result).toBeTruthy();
        expect(result.ers_user_id).toBe(6);
        expect(result.password).toBeUndefined();
    });
    test('should return bad request to User when addNewUser get bad user', async () => {
        // Arrange
        expect.assertions(3);

        Validator.isValidId = jest.fn().mockReturnValue(false);
        Validator.isValidObject = jest.fn().mockReturnValue(true);
        mockRepo.isUsernameAvailable = jest.fn().mockReturnValue(true);
        mockRepo.isEmailAvailable = jest.fn().mockReturnValue(true);
        mockRepo.save =  jest.fn().mockReturnValue(mockUsers[5]);
        // Act
        try {

            let newUser = new User(6, 'test', 'password', 'test', 'test', 'test@revature.com', 'User')
            await sut.addNewUser(newUser);

        } catch (e) {

            // Assert
            expect(e instanceof BadRequestError).toBe(true);

        }
    });
    test('should return bad request to User when addNewUser get dup username', async () => {
        // Arrange
        expect.assertions(3);

        Validator.isValidId = jest.fn().mockReturnValue(true);
        Validator.isValidObject = jest.fn().mockReturnValue(true);
        mockRepo.isUsernameAvailable = jest.fn().mockReturnValue(false);
        mockRepo.isEmailAvailable = jest.fn().mockReturnValue(true);
        mockRepo.save =  jest.fn().mockReturnValue(mockUsers[5]);

        // Act
        try {

            let newUser = new User(6, 'test', 'password', 'test', 'test', 'test@revature.com', 'User')
            await sut.addNewUser(newUser);

        } catch (e) {

            // Assert
            expect(e instanceof ResourcePersistenceError).toBe(true);
            
        }
    });
    test('should return bad request to User when addNewUser get dup email', async () => {
        // Arrange
        expect.assertions(3);

        Validator.isValidId = jest.fn().mockReturnValue(true);
        Validator.isValidObject = jest.fn().mockReturnValue(true);
        mockRepo.isUsernameAvailable = jest.fn().mockReturnValue(true);
        mockRepo.isEmailAvailable = jest.fn().mockReturnValue(false);
        mockRepo.save =  jest.fn().mockReturnValue(mockUsers[5]);

        // Act
        try {

            let newUser = new User(6, 'test', 'password', 'test', 'test', 'test@revature.com', 'User')
            await sut.addNewUser(newUser);

        } catch (e) {

            // Assert
            expect(e instanceof ResourcePersistenceError).toBe(true);
            
        }
    });
    test('should resolve to User when updateUser', async () => {
        // Arrange
        expect.assertions(3);

        Validator.isValidObject = jest.fn().mockReturnValue(true);
        mockRepo.update =  jest.fn().mockReturnValue(mockUsers[5]);

        // Act
        // id, name , value
        let result = await sut.updateUser(mockUsers[0]);

        // Assert
        expect(result).toBeTruthy();
    });
    test('should return bad request to User when updateUser get bad user', async () => {
        // Arrange
        expect.assertions(3);

        Validator.isValidObject = jest.fn().mockReturnValue(false);
        mockRepo.update =  jest.fn().mockReturnValue(mockUsers[5]);

        // Act
        try {
            let newUser = new User(6, 'test', 'password', 'test', 'test', 'test@revature.com', 'User')
            await sut.addNewUser(newUser);

        } catch (e) {
            // Assert
            expect(e instanceof BadRequestError).toBe(true);

        }
    });
    test('should return NotImplementedError to User when deleteById', async () => {
        // Arrange
        expect.assertions(1);

        // Act
        try {
            await sut.deleteById(0);

        } catch (e) {
            // Assert
            expect(e instanceof NotImplementedError).toBe(true);
            
        }
    });
});