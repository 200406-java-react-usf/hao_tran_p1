import { Reimb } from "../models/reimb";
import { ReimbRepository } from "../repos/reimb-repo";
import { isValidId, isValidStrings, isValidObject, isPropertyOf, isEmptyObject } from "../util/validator";
import { 
    BadRequestError, 
    ResourceNotFoundError, 
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

    /**
     * Gets reimb by unique key
     * @param queryObj 
     * @returns reimb by unique key 
     */
    async getReimbByUniqueKey(queryObj: any): Promise<Reimb> {

        try {
            let queryKeys = Object.keys(queryObj);
            if(!queryKeys.every(key => isPropertyOf(key, Reimb))) {
                throw new BadRequestError();
            }
            let key = queryKeys[0];
            let val = queryObj[key];

            if (key === 'ers_reimb_id') {
                return await this.getReimbById(+val);
            }
            // ensure that the provided key value is valid
            if(!isValidStrings(val)) {
                throw new BadRequestError();
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

    async addNewReimb(newReimb: Reimb): Promise<Reimb> {
        
        try {

            if (!isValidObject(newReimb, 'id')) {
                throw new BadRequestError('Invalid property values found in provided reimb.');
            }

            newReimb.reimb_status = 'pending'; // all new registers have 'Reimb' role by default
            const persistedReimb = await this.reimbRepo.save(newReimb);

            return persistedReimb;

        } catch (e) {
            throw e
        }

    }

    async updateReimb(updatedReimb: Reimb): Promise<boolean> {
        
        try {
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