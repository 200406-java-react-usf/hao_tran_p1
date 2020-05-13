import { ReimbRepository } from '../repos/reimb-repo';
import * as mockIndex from '..';
import * as mockMapper from '../util/result-set-mapper';
import { Reimb } from '../models/reimb';
import { InternalServerError } from '../errors/errors';

jest.mock('..', () => {
    return {
        connectionPool: {
            connect: jest.fn()
        }
    };
});

jest.mock('../util/result-set-mapper', () => {
    return {
        mapReimbResultSet: jest.fn()
    };
});

describe('reimbRepo', () => {

    let sut = new ReimbRepository();
    let mockConnect = mockIndex.connectionPool.connect;

    beforeEach(() => {

        (mockConnect as jest.Mock).mockClear().mockImplementation(() => {
            return {
                query: jest.fn().mockImplementation(() => {
                    return {
                        rows: [
                            {
                                reimb_id: 6,
                                amount: 100,
                                submitted: new Date(),
                                resolved: new Date(),
                                description: 'description',
                                reciept: "any",
                                author: "test",
                                resolver: "test",
                                reimb_status: "pending",
                                reimb_type: "food"
                            }
                        ]
                    };
                }), 
                release: jest.fn()
            };
        });
        
        (mockMapper.mapReimbResultSet as jest.Mock).mockClear();
    });

    test('should resolve to an array of Reimbs when getAll retrieves records from data source', async () => {
        
        // Arrange
        expect.hasAssertions();
        let date = new Date();
        let mockReimb = new Reimb(1, 100, date, date, 'text', 'reciept', 'author-test', 'resv-test', 'pending', 'food');
        (mockMapper.mapReimbResultSet as jest.Mock).mockReturnValue(mockReimb);

        // Act
        let result = await sut.getAll();

        // Assert
        expect(result).toBeTruthy();
        expect(result instanceof Array).toBe(true);
        expect(result.length).toBe(1);
        expect(mockConnect).toBeCalledTimes(1);

    });

    test('should resolve to an empty array when getAll retrieves a records from data source', async () => {
        
        // Arrange
        expect.hasAssertions();
        (mockConnect as jest.Mock).mockImplementation(() => {
            return {
                query: jest.fn().mockImplementation(() => { return { rows: [] }; }), 
                release: jest.fn()
            };
        });

        // Act
        let result = await sut.getAll();

        // Assert
        expect(result).toBeTruthy();
        expect(result instanceof Array).toBe(true);
        expect(result.length).toBe(0);
        expect(mockConnect).toBeCalledTimes(1);

    });

    test('should throw InternalServerError when getAll() is called but query is unsuccesful', async () => {

        // Arrange
        expect.hasAssertions();
        (mockConnect as jest.Mock).mockImplementation( () => {
            return {
                query: jest.fn().mockImplementation( () => { throw new Error(); }),
                release: jest.fn()
            };
        });

        // Act
        try {
            await sut.getAll();
        } catch (e) {
            // Assert
            expect(e instanceof InternalServerError).toBe(true);
        }
    });

    test('should resolve to a Reimb object when getById retrieves a record from data source', async () => {

        // Arrange
        expect.hasAssertions();
        let date = new Date();
        let mockReimb = new Reimb(1, 100, date, date, 'text', 'reciept', 'author-test', 'resv-test', 'pending', 'food');
        (mockMapper.mapReimbResultSet as jest.Mock).mockReturnValue(mockReimb);

        // Act
        let result = await sut.getById(1);

        // Assert
        expect(result).toBeTruthy();
        expect(result instanceof Reimb).toBe(true);

    });

    test('should resolve to an empty array when getById retrieves a record from data source', async () => {

        // Arrange
        expect.hasAssertions();
        
        (mockConnect as jest.Mock).mockImplementation(() => {
            return {
                query: jest.fn().mockImplementation(() => { return { rows: [] }; }), 
                release: jest.fn()
            };
        });

        // Act
        let result = await sut.getById(1);

        // Assert
        expect(result).toBeTruthy();
        expect(result instanceof Reimb).toBe(true);

    });

    test('should throw InternalServerError when getById() is called but query is unsuccesful', async () => {

        // Arrange
        expect.hasAssertions();
        let date = new Date();
        let mockReimb = new Reimb(1, 100, date, date, 'text', 'reciept', 'author-test', 'resv-test', 'pending', 'food');
        (mockConnect as jest.Mock).mockImplementation( () => {
            return {
                query: jest.fn().mockImplementation( () => { return false; }),
                release: jest.fn()
            };
        });

        // Act
        try {
            await sut.getById(mockReimb.ers_reimb_id);
        } catch (e) {
            // Assert
            expect(e instanceof InternalServerError).toBe(true);
        }
    });

    test('should resolve to a Reimb object when getReimbByUniqueKey retrieves a record from data source', async () => {

        // Arrange
        expect.hasAssertions();

        let date = new Date();
        let mockReimb = new Reimb(1, 100, date, date, 'text', 'reciept', 'author-test', 'resv-test', 'pending', 'food');
        (mockMapper.mapReimbResultSet as jest.Mock).mockReturnValue(mockReimb);

        // Act
        let result = await sut.getReimbByUniqueKey('reimbname', 'aanderson');

        // Assert
        expect(result).toBeTruthy();
        expect(result instanceof Reimb).toBe(true);

    });

    test('should resolve to an empty array when getReimbByUniqueKey retrieves a record from data source', async () => {

        // Arrange
        expect.hasAssertions();
        
        (mockConnect as jest.Mock).mockImplementation(() => {
            return {
                query: jest.fn().mockImplementation(() => { return { rows: [] }; }), 
                release: jest.fn()
            };
        });

        // Act
        let result = await sut.getReimbByUniqueKey('reimbname', 'aanderson');

        // Assert
        expect(result).toBeTruthy();
        expect(result instanceof Reimb).toBe(true);

    });

    test('should resolve to a Reimb object when save persists a record to the data source', async () => {

        // Arrange
        expect.hasAssertions();

        let date = new Date();
        let mockReimb = new Reimb(1, 100, date, date, 'text', 'reciept', 'author-test', 'resv-test', 'pending', 'food');
        (mockMapper.mapReimbResultSet as jest.Mock).mockReturnValue(mockReimb);

        // Act
        let result = await sut.save(mockReimb);

        // Assert
        expect(result).toBeTruthy();
        expect(result instanceof Reimb).toBe(true);

    });

    test('should resolve to an empty array when save persists a record to the data source', async () => {

        // Arrange
        expect.hasAssertions();
        let date = new Date();
        let mockReimb = new Reimb(1, 100, date, date, 'text', 'reciept', 'author-test', 'resv-test', 'pending', 'food');
        (mockConnect as jest.Mock).mockImplementation(() => {
            return {
                query: jest.fn().mockImplementation(() => { return { rows: [] }; }), 
                release: jest.fn()
            };
        });

        // Act
        let result = await sut.save(mockReimb);

        // Assert
        expect(result).toBeTruthy();
        expect(result instanceof Reimb).toBe(true);

    });

    test('should resolve to true when update updates a record on the data source', async () => {

        // Arrange
        expect.hasAssertions();

        let date = new Date();
        let mockReimb = new Reimb(1, 100, date, date, 'text', 'reciept', 'author-test', 'resv-test', 'pending', 'food');
        (mockMapper.mapReimbResultSet as jest.Mock).mockReturnValue(true);

        // Act
        let result = await sut.update(mockReimb);

        // Assert
        expect(result).toBeTruthy();
        expect(result).toBe(true);

    });

    test('should resolve to true when deleteById deletes a record on the data source', async () => {

        // Arrange
        expect.hasAssertions();

        
        (mockMapper.mapReimbResultSet as jest.Mock).mockReturnValue(true);

        // Act
        let result = await sut.deleteById(2);

        // Assert
        expect(result).toBeTruthy();
        expect(result).toBe(true);

    });

    test('should throw InternalServerError when deleteById() is called but query is unsuccesful', async () => {

        // Arrange
        expect.hasAssertions();
        
        (mockConnect as jest.Mock).mockImplementation( () => {
            return {
                query: jest.fn().mockImplementation( () => { throw new Error(); }),
                release: jest.fn()
            };
        });

        // Act
        try {
            await sut.deleteById(1);
        } catch (e) {
            // Assert
            expect(e instanceof InternalServerError).toBe(true);
        }
    });
});