import { ReimbService } from '../services/reimb-service';
import { ReimbRepository } from '../repos/reimb-repo';
import { Reimb } from '../models/reimb';
import Validator from '../util/validator';
import {
    ResourceNotFoundError,
    BadRequestError,
    AuthenticationError,
    ResourcePersistenceError,
    NotImplementedError
} from '../errors/errors';

jest.mock('../repos/Reimb-repo', () => {

    return new class ReimbRepository {
        getAll = jest.fn();
        getById = jest.fn();
        getReimbByUniqueKey = jest.fn();
        save = jest.fn();
        update = jest.fn();
        deleteById = jest.fn();
        getReimbByFilter = jest.fn();
    }

});
describe('ReimbService', () => {

    let sut: ReimbService;
    let mockRepo;
    let date = new Date();
    let mockReimbs = [
        new Reimb(1, 100, date, date, 'text', 'reciept', 'author-test', 'resv-test', 'pending', 'food'),
        new Reimb(2, 200, date, date, 'text', 'reciept', 'author-test', 'resv-test', 'approved', 'food'),
        new Reimb(3, 300, date, date, 'text', 'reciept', 'author-test', 'resv-test', 'approved', 'food'),
        new Reimb(4, 400, date, date, 'text', 'reciept', 'author-test', 'resv-test', 'approved', 'food'),
        new Reimb(5, 500, date, date, 'text', 'reciept', 'author-test', 'resv-test', 'approved', 'food')
    ];

    beforeEach(() => {

        mockRepo = jest.fn(() => {
            return {
                getAll: jest.fn(),
                getById: jest.fn(),
                getReimbByUniqueKey: jest.fn(),
                save: jest.fn(),
                update: jest.fn(),
                deleteById: jest.fn()
            }
        });

        // @ts-ignore
        sut = new ReimbService(mockRepo);

    });
    // get all -no resource error
    test('should resolve to getAllReimbs[] (without passwords) when getAllgetAllReimbs() successfully retrieves getAllReimbs from the data source', async () => {

        // Arrange
        expect.hasAssertions();
        mockRepo.getAll = jest.fn().mockReturnValue(mockReimbs);

        // Act
        let result = await sut.getAllReimbs();

        // Assert
        expect(result).toBeTruthy();
        expect(result.length).toBe(5);
    });

    test('should reject with ResourceNotFoundError when getAllgetAllReimbs fails to get any getAllReimbs from the data source', async () => {

        // Arrange
        expect.assertions(1);
        mockRepo.getAll = jest.fn().mockReturnValue([]);

        // Act
        try {
            await sut.getAllReimbs();
        } catch (e) {

            // Assert
            expect(e instanceof ResourceNotFoundError).toBe(true);
        }

    });
    // get by id - bad req, no resource
    test('should resolve to Reimb when getReimbById is given a valid an known id', async () => {

        // Arrange
        expect.assertions(2);

        Validator.isValidId = jest.fn().mockReturnValue(true);

        mockRepo.getById = jest.fn().mockImplementation((id: number) => {
            return new Promise<Reimb>((resolve) => resolve(mockReimbs[id - 1]));
        });


        // Act
        let result = await sut.getReimbById(1);

        // Assert
        expect(result).toBeTruthy();
        expect(result.reimb_id).toBe(1);
    });

    test('should reject with BadRequestError when getReimbById is given a invalid value as an id (decimal)', async () => {

        // Arrange
        expect.hasAssertions();
        mockRepo.getById = jest.fn().mockReturnValue(false);

        // Act
        try {
            await sut.getReimbById(3.14);
        } catch (e) {

            // Assert
            expect(e instanceof BadRequestError).toBe(true);
        }

    });

    test('should reject with BadRequestError when getReimbById is given a invalid value as an id (zero)', async () => {

        // Arrange
        expect.hasAssertions();
        mockRepo.getById = jest.fn().mockReturnValue(false);

        // Act
        try {
            await sut.getReimbById(0);
        } catch (e) {

            // Assert
            expect(e instanceof BadRequestError).toBe(true);
        }

    });

    test('should reject with BadRequestError when getReimbById is given a invalid value as an id (NaN)', async () => {

        // Arrange
        expect.hasAssertions();
        mockRepo.getById = jest.fn().mockReturnValue(false);

        // Act
        try {
            await sut.getReimbById(NaN);
        } catch (e) {

            // Assert
            expect(e instanceof BadRequestError).toBe(true);
        }

    });

    test('should reject with BadRequestError when getReimbById is given a invalid value as an id (negative)', async () => {

        // Arrange
        expect.hasAssertions();
        mockRepo.getById = jest.fn().mockReturnValue(false);

        // Act
        try {
            await sut.getReimbById(-2);
        } catch (e) {

            // Assert
            expect(e instanceof BadRequestError).toBe(true);
        }

    });

    test('should reject with ResourceNotFoundError if getReimbById is given an unknown id', async () => {

        // Arrange
        expect.hasAssertions();
        mockRepo.getById = jest.fn().mockReturnValue(true);

        // Act
        try {
            await sut.getReimbById(9999);
        } catch (e) {

            // Assert
            expect(e instanceof ResourceNotFoundError).toBe(true);
        }

    });

    test('should reject with reimb related to user', async () => {

        // Arrange
        expect.assertions(2);
        Validator.isValidId = jest.fn().mockReturnValue(true);
        mockRepo.getByUserId = jest.fn().mockReturnValue(mockReimbs);

        // Act
        let result = await sut.getReimbByUser(1);
        // Assert
        expect(result).toBeTruthy();
        expect(result.length).toBe(5);

    });

    test('should reject with BadRequestError if no reimb', async () => {

        // Arrange
        expect.hasAssertions();
        Validator.isValidId = jest.fn().mockReturnValue(false);
        mockRepo.getByUserId = jest.fn().mockReturnValue(mockReimbs);

        // Act
        try {
            await sut.getReimbByUser(-1);
        } catch (e) {
            // Assert
            expect(e instanceof BadRequestError).toBe(true);
        }

    });
    test('should reject with ResourceNotFoundError if no reimb', async () => {

        // Arrange
        expect.hasAssertions();
        Validator.isValidId = jest.fn().mockReturnValue(true);
        mockRepo.getByUserId = jest.fn().mockReturnValue({});

        // Act
        try {
            await sut.getReimbByUser(1);
        } catch (e) {
            // Assert
            expect(e instanceof ResourceNotFoundError).toBe(true);
        }

    });
    //get by key, return list - bad req, no resource
    test('should resolve to Reimb when getReimbByUniqueKey is given a valid an known key(Reimbname)', async () => {

        // Arrange
        expect.assertions(2);

        Validator.isPropertyOf = jest.fn().mockReturnValue(true);
        Validator.isEmptyObject = jest.fn().mockReturnValue(false);
        Validator.isValidId = jest.fn().mockReturnValue(true);

        mockRepo.getReimbByUniqueKey = jest.fn().mockImplementation((key: string, val: any) => {
            return new Promise<Reimb>((resolve) => {
                resolve(mockReimbs.find(user => user[key] === val));
            });
        });

        // Act
        let query = {
            amount: 100
        }
        let result = await sut.getReimbByUniqueKey(query);

        // Assert
        expect(result).toBeTruthy();
        expect(result.reimb_id).toBe(1);
    });
    test('should resolve to Reimb when getReimbByUniqueKey is given id', async () => {

        // Arrange
        expect.assertions(2);

        Validator.isPropertyOf = jest.fn().mockReturnValue(true);
        Validator.isEmptyObject = jest.fn().mockReturnValue(false);
        Validator.isValidId = jest.fn().mockReturnValue(true);
        mockRepo.getById = jest.fn().mockReturnValue(mockReimbs[0]);

        mockRepo.getReimbByUniqueKey = jest.fn().mockImplementation((key: string, val: any) => {
            return new Promise<Reimb>((resolve) => {
                resolve(mockReimbs.find(user => user[key] === val));
            });
        });

        // Act
        let query = {
            reimb_id: 1
        }
        let result = await sut.getReimbByUniqueKey(query);

        // Assert
        expect(result).toBeTruthy();
        expect(result.reimb_id).toBe(1);
    });

    test('should reject with BadRequestError if invalid key', async () => {

        // Arrange
        expect.hasAssertions();
        Validator.isPropertyOf = jest.fn().mockReturnValue(false);
        Validator.isEmptyObject = jest.fn().mockReturnValue(false);
        Validator.isValidId = jest.fn().mockReturnValue(true);
        mockRepo.getReimbByUniqueKey = jest.fn().mockImplementation((key: string, val: any) => {
            return new Promise<Reimb>((resolve) => {
                resolve(mockReimbs.find(user => user[key] === val));
            });
        });


        // Act
        let query = {
            test: 'aanderson'
        }
        try {
            await sut.getReimbByUniqueKey(query);
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
            Reimbname: 'aanderson'
        }
        try {
            await sut.getReimbByUniqueKey(query);
        } catch (e) {

            // Assert
            expect(e instanceof BadRequestError).toBe(true);
        }

    });
    test('should reject with BadRequestError if valid key but no result', async () => {

        // Arrange
        expect.hasAssertions();
        Validator.isPropertyOf = jest.fn().mockReturnValue(true);
        Validator.isValidStrings = jest.fn().mockReturnValue(true);
        Validator.isEmptyObject = jest.fn().mockReturnValue({});
        mockRepo.getReimbByUniqueKey = jest.fn().mockImplementation(() => {
            return new Promise<Reimb>((resolve) => {
                resolve({} as Reimb);
            });
        });
        // Act
        let query = {
            amount: 999
        }
        try {
            await sut.getReimbByUniqueKey(query);
        } catch (e) {

            // Assert
            expect(e instanceof ResourceNotFoundError).toBe(true);
        }



    });
    // submit save - bad req
    test('should save to Reimb', async () => {

        // Arrange
        expect.assertions(2);
        Validator.isValidId = jest.fn().mockReturnValue(true);
        Validator.isValidObject = jest.fn().mockReturnValue(true);
        mockRepo.save = jest.fn().mockImplementation((newReimb: Reimb) => {
            return new Promise<Reimb>((resolve) => {
                mockReimbs.push(newReimb);
                resolve(newReimb);
            });
        });

        // Act
        let newReimb = new Reimb(6, 500, date, date, 'text', 'reciept', 'author-test', 'resv-test', 'approved', 'food');
        let result = await sut.addNewReimb(newReimb);
        // Assert
        expect(result).toBeTruthy();
        expect(result.reimb_id).toBe(6);
    });
    test('should reject with BadRequestError if invalid reimb', async () => {

        // Arrange
        expect.hasAssertions();
        Validator.isValidId = jest.fn().mockReturnValue(true);
        Validator.isValidObject = jest.fn().mockReturnValue(true);
        mockRepo.save = jest.fn().mockImplementation((newReimb: Reimb) => {
            return new Promise<Reimb>((resolve) => {
                mockReimbs.push(newReimb);
                resolve(newReimb);
            });
        });

        // Act
        let newReimb = new Reimb(6, 500, date, null, 'text', 'reciept', 'author-test', 'resv-test', 'approved', null);

        try {
            await sut.addNewReimb(newReimb);
        } catch (e) {

            // Assert
            expect(e instanceof BadRequestError).toBe(true);
        }

    });
    // approve or deny - bad req, no return
    test('should update to Reimb approve', async () => {

        // Arrange
        expect.hasAssertions();

        Validator.isValidId = jest.fn().mockReturnValue(true);
        Validator.isValidStatus = jest.fn().mockReturnValue(true);
        mockReimbs[0].reimb_status = 'pending'
        mockRepo.update = jest.fn().mockReturnValue(mockReimbs[0]);

        // Act
        //arg: id, author, status
        let result = await sut.updateReimb(mockReimbs[0]);

        // Assert
        expect(result).toBeTruthy();
    });

    test('should reject with BadRequestError if invalid id', async () => {

        // Arrange
        //expect.hasAssertions();
        Validator.isValidId = jest.fn().mockReturnValue(false);
        Validator.isValidStatus = jest.fn().mockReturnValue(true);
        mockReimbs[0].reimb_status = 'approved'
        mockRepo.update = jest.fn().mockReturnValue({});

        // Act
        let newReimb = new Reimb(7, 500, date, date, 'text', 'reciept', 'author-test', 'resv-test', 'approved', 'food');

        try {
            await sut.updateReimb(newReimb);
        } catch (e) {

            // Assert
            expect(e instanceof BadRequestError).toBe(true);
        }

    });
    test('should reject with ResourcePersistenceError if invalid status', async () => {

        // Arrange
        expect.hasAssertions();
        Validator.isValidId = jest.fn().mockReturnValue(true);
        Validator.isValidObject = jest.fn().mockReturnValue(true);
        Validator.isValidStatus = jest.fn().mockReturnValue(false);

        mockRepo.update = jest.fn().mockReturnValue(mockReimbs[0]);
        // Act

        let newReimb = new Reimb(6, 500, date, date, 'text', 'reciept', 'author-test', 'resv-test', null, 'food');

        try {
            await sut.updateReimb(newReimb);
        } catch (e) {
            // Assert
            expect(e instanceof BadRequestError).toBe(true);
        }

    });
    test('should reject with ResourcePersistenceError if invalid reimb', async () => {

        // Arrange
        expect.hasAssertions();
        Validator.isValidId = jest.fn().mockReturnValue(true);
        Validator.isValidObject = jest.fn().mockReturnValue(false);
        Validator.isValidStatus = jest.fn().mockReturnValue(true);

        mockRepo.update = jest.fn().mockReturnValue(mockReimbs[0]);
        // Act

        let newReimb = new Reimb(6, 500, date, date, 'text', 'reciept', 'author-test', 'resv-test', null, 'food');

        try {
            await sut.updateReimb(newReimb);
        } catch (e) {
            // Assert
            expect(e instanceof BadRequestError).toBe(true);
        }

    });

    test('should reject with ResourcePersistenceError if invalid id', async () => {

        // Arrange
        expect.hasAssertions();
        Validator.isValidId = jest.fn().mockReturnValue(false);
        Validator.isValidObject = jest.fn().mockReturnValue(true);
        Validator.isValidStatus = jest.fn().mockReturnValue(true);

        mockRepo.update = jest.fn().mockReturnValue(mockReimbs[0]);
        // Act

        let newReimb = new Reimb(null, 500, date, date, 'text', 'reciept', 'author-test', 'resv-test', null, 'food');

        try {
            await sut.updateReimb(newReimb);
        } catch (e) {
            // Assert
            expect(e instanceof BadRequestError).toBe(true);
        }

    });

    test('should reject with ResourcePersistenceError if invalid status', async () => {

        // Arrange
        expect.hasAssertions();
        Validator.isValidId = jest.fn().mockReturnValue(true);
        Validator.isValidObject = jest.fn().mockReturnValue(true);
        Validator.isValidStatus = jest.fn().mockReturnValue(false);

        mockRepo.update = jest.fn().mockReturnValue(mockReimbs[0]);
        // Act

        let newReimb = new Reimb(1, 500, date, date, 'text', 'reciept', 'author-test', 'resv-test', "test", 'food');

        try {
            await sut.updateReimb(newReimb);
        } catch (e) {
            // Assert
            expect(e instanceof BadRequestError).toBe(true);
        }

    });
    // delete, not imp
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
    test('should filterReimb with status and type', async () => {

        // Arrange
        expect.assertions(2);
        mockRepo.getReimbByFilter = jest.fn().mockReturnValue(mockReimbs);
        
        let query = {
            status: "pending",
            type: "food"
        }
        // Act
        let result = await sut.filterReimb(1);
        // Assert
        expect(result).toBeTruthy();
        expect(result.length).toBe(6);

    });
});