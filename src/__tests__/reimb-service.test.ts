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
    }

});
describe('ReimbService', () => {

    let sut: ReimbService;
    let mockRepo;

    let mockReimbs = [
        new Reimb(1, 100, Date(), Date(), "text", "reciept", "author-test", "resv-test", "pending", "food"),
        new Reimb(2, 200, Date(), Date(), "text", "reciept", "author-test", "resv-test", "approved", "food"),
        new Reimb(3, 300, Date(), Date(), "text", "reciept", "author-test", "resv-test", "approved", "food"),
        new Reimb(4, 400, Date(), Date(), "text", "reciept", "author-test", "resv-test", "approved", "food"),
        new Reimb(5, 500, Date(), Date(), "text", "reciept", "author-test", "resv-test", "approved", "food")
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
    test('should resolve to getAllReimb[] (without passwords) when getAllgetAllReimb() successfully retrieves getAllReimb from the data source', async () => {

        // Arrange
        expect.hasAssertions();
        mockRepo.getAll = jest.fn().mockReturnValue(mockReimbs);

        // Act
        let result = await sut.getAllReimb();

        // Assert
        expect(result).toBeTruthy();
        expect(result.length).toBe(5);
    });

    test('should reject with ResourceNotFoundError when getAllgetAllReimb fails to get any getAllReimb from the data source', async () => {

        // Arrange
        expect.assertions(1);
        mockRepo.getAll = jest.fn().mockReturnValue([]);

        // Act
        try {
            await sut.getAllReimb();
        } catch (e) {

            // Assert
            expect(e instanceof ResourceNotFoundError).toBe(true);
        }

    });
    // get by id - bad req, no resource
    test('should resolve to Reimb when getReimbById is given a valid an known id', async () => {

        // Arrange
        expect.assertions(3);

        Validator.isValidId = jest.fn().mockReturnValue(true);

        mockRepo.getById = jest.fn().mockImplementation((id: number) => {
            return new Promise<Reimb>((resolve) => resolve(mockReimbs[id - 1]));
        });


        // Act
        let result = await sut.getReimbById(1);

        // Assert
        expect(result).toBeTruthy();
        expect(result.ers_Reimb_id).toBe(1);
        expect(result.password).toBeUndefined();

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
    // get by key, return list - bad req, no resource
    test('should resolve to Reimb when getReimbByUniqueKey is given a valid an known key(Reimbname)', async () => {

        // Arrange
        expect.assertions(3);

        Validator.isValidId = jest.fn().mockReturnValue(true);

        mockRepo.getById = jest.fn().mockImplementation((id: number) => {
            return new Promise<Reimb>((resolve) => resolve(mockReimbs[id - 1]));
        });

        // Act
        let query = {
            Reimbname: 'aanderson'
        }
        let result = await sut.getReimbByUniqueKey(query);

        // Assert
        expect(result).toBeTruthy();
        expect(result[0].ers_Reimb_id).toBe(1);
        expect(result[0].password).toBeUndefined();

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
        mockRepo.getReimbByCredentials = jest.fn().mockReturnValue(mockReimbs[0]);

        // Act
        let query = {
            Reimbname: 'test'
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
        Validator.isValidObject = jest.fn().mockReturnValue(true);
        mockRepo.save = jest.fn().mockReturnValue(mockReimbs[5]);

        // Act
        //arg: id, author, status
        let result = await sut.submitNewReimb(mockReimbs[5]);
        // Assert
        expect(result).toBeTruthy();
        expect(result.reimb_id).toBe(5);
    });
    test('should reject with BadRequestError if invalid reimb', async () => {

        // Arrange
        expect.hasAssertions();
        Validator.isValidObject = jest.fn().mockReturnValue(false);
        mockRepo.save = jest.fn().mockReturnValue(mockReimbs[5]);

        // Act

        try {
            await sut.submitNewReimb(mockReimbs[5]);
        } catch (e) {

            // Assert
            expect(e instanceof BadRequestError).toBe(true);
        }

    });
    // approve or deny - bad req, no return
    test('should update to Reimb approve', async () => {

        // Arrange
        expect.assertions(2);

        Validator.isValidId = jest.fn().mockReturnValue(true);
        Validator.isValidStatus = jest.fn().mockReturnValue(true);
        mockRepo.getById = jest.fn().mockReturnValue(mockReimbs[0]);
        mockReimbs[0].reimb_status = "approved"
        mockRepo.update = jest.fn().mockReturnValue(mockReimbs[0]);

        // Act
        //arg: id, author, status
        let result = await sut.updateReimb(1, 1, 2);

        // Assert
        expect(result).toBeTruthy();
        expect(result.reimb_status).toBe("approved");
    });
    test('should reject with BadRequestError if invalid id', async () => {

        // Arrange
        expect.hasAssertions();
        Validator.isValidId = jest.fn().mockReturnValue(false);
        Validator.isValidStatus = jest.fn().mockReturnValue(true);
        mockRepo.getById = jest.fn().mockReturnValue(mockReimbs[0]);
        mockReimbs[0].reimb_status = "approved"
        mockRepo.update = jest.fn().mockReturnValue(mockReimbs[0]);

        // Act

        try {
            await sut.updateReimb(1, 1, 2);
        } catch (e) {

            // Assert
            expect(e instanceof BadRequestError).toBe(true);
        }

    });
    test('should reject with ResourcePersistenceError if invalid status', async () => {

        // Arrange
        expect.hasAssertions();
        Validator.isValidId = jest.fn().mockReturnValue(true);
        Validator.isValidStatus = jest.fn().mockReturnValue(false);
        mockRepo.getById = jest.fn().mockReturnValue(mockReimbs[0]);
        mockReimbs[0].reimb_status = "approved"
        mockRepo.update = jest.fn().mockReturnValue(mockReimbs[0]);
        // Act
        try {
            await sut.updateReimb(1, 1, 2);
        } catch (e) {
            // Assert
            expect(e instanceof BadRequestError).toBe(true);
        }

    });
    test('should reject with ResourcePersistenceError if invalid reimb', async () => {

        // Arrange
        expect.hasAssertions();
        Validator.isValidId = jest.fn().mockReturnValue(true);
        Validator.isValidStatus = jest.fn().mockReturnValue(true);
        mockRepo.getById = jest.fn().mockReturnValue({});
        mockReimbs[0].reimb_status = "approved"
        mockRepo.update = jest.fn().mockReturnValue(mockReimbs[0]);
        // Act
        try {
            await sut.updateReimb(1, 1, 2);
        } catch (e) {
            // Assert
            expect(e instanceof ResourcePersistenceError).toBe(true);
        }

    });
    // delet, not imp
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