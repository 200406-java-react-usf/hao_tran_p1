import { ReimbService } from '../services/reimb-service';
import { ReimbRepository } from '../repos/reimb-repo';
import { Reimb } from '../models/reimb';
import Validator from '../util/validator';
import { 
    ResourceNotFoundError, 
    BadRequestError, 
    AuthenticationError, 
    ResourcePersistenceError,
    NotImplementedError } from '../errors/errors';

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
        // reimb_id serial,
        // amount decimal(6, 2) not null,
        // submitted timestamp not null,
        // resolved timestamp not null,
        // description text not null,
        // reciept BYTEA,
        // author_id int not null,
        // resolver_id int,
        // reimb_status_id int not null,
        // reimb_type_id int not null,
        new Reimb(1, 100, Date(), Date(), "text", "reciept", "author-test", "resv-test", "approve", "food")

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
    // get all
    test('should resolve to User[] (without passwords) when getAllUsers() successfully retrieves users from the data source', async () => {

        // Arrange
        expect.hasAssertions();
        mockRepo.getAll = jest.fn().mockReturnValue(mockReimbs);

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
    // get by id
    // get by key 
    // approve or deny
    // submit save
    // delet, not imp
});