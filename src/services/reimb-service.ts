import { Reimb } from "../models/reimb";
import { ReimbRepository } from "../repos/reimb-repo";
import { isValidId, isValidStrings, isValidObject, isPropertyOf, isEmptyObject, isValidStatus } from "../util/validator";
import {
    BadRequestError,
    ResourceNotFoundError,
    ResourcePersistenceError,
    NotImplementedError,
    AuthenticationError
} from "../errors/errors";


export class ReimbService {

    constructor(private reimbRepo: ReimbRepository) {
        this.reimbRepo = reimbRepo;
    }

    /**
     * Gets all reimbs
     * @returns all reimbs 
     */
    async getAllReimbs(): Promise<Reimb[]> {
        let reimbs = await this.reimbRepo.getAll();
        if (reimbs.length == 0) {
            throw new ResourceNotFoundError();
        }
        return reimbs;
    }

    /**
     * Gets reimb by id
     * @param id 
     * @returns reimb by id 
     */
    async getReimbById(id: number): Promise<Reimb> {
        if (!isValidId(id)) {
            throw new BadRequestError();
        }
        let reimb = await this.reimbRepo.getById(id);
        if (isEmptyObject(reimb)) {
            throw new ResourceNotFoundError();
        }
        return reimb;
    }

    async getReimbByUser(id: number): Promise<Reimb[]> {
        if (!isValidId(id)) {
            throw new BadRequestError();
        }
        let reimb = await this.reimbRepo.getByUserId(id);
        if (isEmptyObject(reimb)) {
            throw new ResourceNotFoundError();
        }
        return reimb;
    }
    /**
     * Gets reimb by unique key
     * @param queryObj 
     * @returns reimb by unique key 
     */
    async getReimbByUniqueKey(queryObj: any): Promise<Reimb> {

        try {
            let queryKeys = Object.keys(queryObj);
            if (!queryKeys.every(key => isPropertyOf(key, Reimb))) {
                throw new BadRequestError();
            }
            let key = queryKeys[0];
            let val = queryObj[key];

            if (key === 'reimb_id') {
                return await this.getReimbById(+val);
            }

            let reimb = await this.reimbRepo.getReimbByUniqueKey(key, val);

            if (isEmptyObject(reimb)) {
                throw new ResourceNotFoundError();
            }

            return reimb;

        } catch (e) {
            throw e;
        }
    }

    async filterReimb(query: any): Promise<Reimb[]> {
        
        let status = query.status;
        let type = query.type;
        let reimbs = await this.reimbRepo.getReimbByFilter(status, type);

        return reimbs;
    }

    async addNewReimb(newReimb: Reimb): Promise<Reimb> {
        try {

            if (!isValidObject(newReimb, 'id',"resolved", "resolver", "reciept")) {
                throw new BadRequestError();
            }

            const persistedReimb = await this.reimbRepo.save(newReimb);

            return persistedReimb;

        } catch (e) {
            throw e;
        }

    }

    async updateReimb(updatedReimb: Reimb): Promise<boolean> {

        try {
            if (!isValidId(updatedReimb.reimb_id)) {
                throw new BadRequestError();
            }
            if (!isValidObject(updatedReimb,"resolved", "resolver")) {
                throw new BadRequestError();
            }
            if (!isValidStatus(updatedReimb.reimb_status)) {
                throw new BadRequestError();
            }
            return await this.reimbRepo.update(updatedReimb);
        } catch (e) {
            throw e;
        }

    }

    async deleteById(id: number): Promise<boolean> {

        try {
            throw new NotImplementedError();
        } catch (e) {
            throw e;
        }

    }
}