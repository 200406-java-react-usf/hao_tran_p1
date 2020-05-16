import { User } from '../models/user';
import { CrudRepository } from './crud-repo';
import {
    InternalServerError
} from '../errors/errors';
import { PoolClient } from 'pg';
import { connectionPool } from '..';
import { mapUserResultSet } from '../util/result-set-mapper';

export class UserRepository implements CrudRepository<User> {

    baseQuery = `
    select
    eu.ers_user_id, 
    eu.username, 
    eu.password, 
    eu.first_name,
    eu.last_name,
    eu.email,
    ur.role_name as role_name,
    from ers_users eu,
    join ers_user_roles ur
    
    on eu.user_role_id = ur.role_id
    `;

    /**
     * Gets all users, for testing
     * @returns all user[]
     */
    async getAll(): Promise<User[]> {
        let client: PoolClient;
        try {
            client = await connectionPool.connect();
            let sql = `${this.baseQuery}`;
            let rs = await client.query(sql); // rs = ResultSet
            return rs.rows.map(mapUserResultSet);
        } catch (e) {
            console.log(e);
            throw new InternalServerError();
        } finally {
            client && client.release();
        }
    }


    /**
     * Gets by id
     * @param id 
     * @returns by id 
     */
    async getById(id: number): Promise<User> {
        let client: PoolClient;
        try {
            client = await connectionPool.connect();
            let sql = `${this.baseQuery} where eu.ers_user_id = $1`;
            let rs = await client.query(sql, [id]);
            return mapUserResultSet(rs.rows[0]);
        } catch (e) {
            throw new InternalServerError();
        } finally {
            client && client.release();
        }
    }

    /**
     * Gets user by unique key
     * @param key 
     * @param val 
     * @returns user by unique key 
     */
    async getUserByUniqueKey(key: string, val: string): Promise<User> {
        let client: PoolClient;
        try {
            client = await connectionPool.connect();
            let sql = `${this.baseQuery} where eu.${key} = $1`;
            let rs = await client.query(sql, [val]);
            return mapUserResultSet(rs.rows[0]);
        } catch (e) {
            throw new InternalServerError();
        } finally {
            client && client.release();
        }
    }


    /**
     * Gets user by credentials
     * @param un 
     * @param pw 
     * @returns  
     */
    async getUserByCredentials(un: string, pw: string) {
        let client: PoolClient;
        try {
            client = await connectionPool.connect();
            let sql = `${this.baseQuery} where eu.username = $1 and eu.password = $2`;
            let rs = await client.query(sql, [un, pw]);
            return mapUserResultSet(rs.rows[0]);
        } catch (e) {
            throw new InternalServerError();
        } finally {
            client && client.release();
        }
    }


    /**
     * Saves user repository
     * @param newUser 
     * @returns save 
     */
    async save(newUser: User): Promise<User> {
        let client: PoolClient;
        try {
            client = await connectionPool.connect();
            // WIP: hacky fix since we need to make two DB calls
            let roleId = (await client.query('select role_id from ers_user_roles where name = $1', [newUser.role_name])).rows[0].role_id;

            let sql = `
                insert into ers_users (username, password, first_name, last_name, email, user_role_id) 
                values ($1, $2, $3, $4, $5, $6) returning ers_user_id
            `;
            let rs = await client.query(sql, [newUser.username, newUser.password, newUser.first_name, newUser.last_name, newUser.email, roleId]);

            newUser.ers_user_id = rs.rows[0].ers_user_id;

            return newUser;

        } catch (e) {
            console.log(e);
            throw new InternalServerError();
        } finally {
            client && client.release();
        }

    }

    /**
     * Updates user repository
     * @param updatedUser 
     * @returns boolean 
     */
    async update(updatedUser: User): Promise<boolean> {
        let client: PoolClient;
        try {
            client = await connectionPool.connect();
            let roleId = (await client.query('select role_id from ers_user_roles where name = $1', [updatedUser.role_name])).rows[0].role_id;
            let sql = `update ers_users set username = $2 password = $3 first_name = $4 last_name = $5 email = $6  user_role_id = $7 where user_role_id = $1`;
            let rs = await client.query(sql, [updatedUser.ers_user_id, updatedUser.username, updatedUser.password, updatedUser.first_name, updatedUser.last_name, updatedUser.email, roleId]);
            return true;
        } catch (e) {
            throw new InternalServerError();
        } finally {
            client && client.release();
        }

    }

    /**
     * Deletes by id
     * @param id  
     * @returns by id 
     */
    async deleteById(id: number): Promise<boolean> {
        let client: PoolClient;
        try {
            client = await connectionPool.connect();
            let sql = `delete from ers_users where ers_user_id = $1`;
            let rs = await client.query(sql, [id]);
            return true;
        } catch (e) {
            throw new InternalServerError();
        } finally {
            client && client.release();
        }

    }

}
