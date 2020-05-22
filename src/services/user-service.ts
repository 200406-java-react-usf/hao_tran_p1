import { User } from "../models/user";
import { UserRepository } from "../repos/user-repo";
import { isValidId, isValidStrings, isValidObject, isPropertyOf, isEmptyObject } from "../util/validator";
import { 
    BadRequestError, 
    ResourceNotFoundError, 
    NotImplementedError, 
    ResourcePersistenceError, 
    AuthenticationError 
} from "../errors/errors";


export class UserService {

    constructor(private userRepo: UserRepository) {
        this.userRepo = userRepo;
    }

    /**
     * Gets all users
     * @returns all users 
     */
    async getAllUsers(): Promise<User[]> {
        let users = await this.userRepo.getAll();
        if (users.length == 0) {
            throw new ResourceNotFoundError();
        }
        return users;
    }

    /**
     * Gets user by id
     * @param id 
     * @returns user by id 
     */
    async getUserById(id: number): Promise<User> {
        if (!isValidId(id)) {
            throw new BadRequestError();
        }
        let user = await this.userRepo.getById(id);
        if (isEmptyObject(user)) {
            throw new ResourceNotFoundError();
        }
        return user;
    }

    /**
     * Gets user by unique key
     * @param queryObj 
     * @returns user by unique key 
     */
    async getUserByUniqueKey(queryObj: any): Promise<User> {

        try {
            let queryKeys = Object.keys(queryObj);
            if(!queryKeys.every(key => isPropertyOf(key, User))) {
                throw new BadRequestError();
            }
            let key = queryKeys[0];
            let val = queryObj[key];

            if (key === 'ers_user_id') {
                return await this.getUserById(+val);
            }
            // ensure that the provided key value is valid
            if(!isValidStrings(val)) {
                throw new BadRequestError();
            }

            let user = await this.userRepo.getUserByUniqueKey(key, val);

            if (isEmptyObject(user)) {
                throw new ResourceNotFoundError();
            }

            return user;

        } catch (e) {
            throw e;
        }
    }

    async authenticateUser(un: string, pw: string): Promise<User> {

        try {

            if (!isValidStrings(un, pw)) {
                throw new BadRequestError();
            }

            let authUser: User;
            authUser = await this.userRepo.getUserByCredentials(un, pw);

            if (isEmptyObject(authUser)) {
                throw new AuthenticationError();
            }

            return authUser;

        } catch (e) {
            throw e;
        }

    }

    async addNewUser(newUser: User): Promise<User> {
        
        try {

            if (!isValidObject(newUser, 'ers_user_id')) {
                throw new BadRequestError();
            }

            let usernameAvailable = await this.isUsernameAvailable(newUser.username);

            if (!usernameAvailable) {
                throw new ResourcePersistenceError();
            }
        
            let emailAvailable = await this.isEmailAvailable(newUser.email);
    
            if (!emailAvailable) {
                throw new  ResourcePersistenceError();
            }
            const persistedUser = await this.userRepo.save(newUser);

            return persistedUser;

        } catch (e) {
            throw e;
        }

    }

    async updateUser(updatedUser: User): Promise<boolean> {
        
        try {
            return await this.userRepo.update(updatedUser);
        } catch (e) {
            throw e;
        }

    }

    async deleteById(id: number): Promise<boolean> {
        try {
            return await this.userRepo.deleteById(id);
        } catch (e) {
            throw e;
        }

    }

    private async isUsernameAvailable(username: string): Promise<boolean> {

        try {
            await this.getUserByUniqueKey({'username': username});
        } catch (e) {
            return true;
        }

        return false;

    }

    private async isEmailAvailable(email: string): Promise<boolean> {
        
        try {
            await this.getUserByUniqueKey({'email': email});
        } catch (e) {
            return true;
        }

        return false;
    }



}