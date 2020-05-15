
// import { CrudRepository } from "./crud-repo";
// import { Reimb } from "../models/reimb";
// import { PoolClient } from 'pg';
// import { connectionPool } from '..';
// import { mapReimbResultSet } from "../util/result-set-mapper"
// import {
//     BadRequestError,
//     ResourceNotFoundError,
//     InternalServerError,
//     NotImplementedError,
//     ResourcePersistenceError,
//     AuthenticationError
// } from "../errors/errors";
// import {
//     isValidId,
//     isValidStrings,
//     isEmptyObject
// } from "../util/validator"

// export class ReimbRepository implements CrudRepository<Reimb> {
//     baseQuery = `
//     select
//         re.reimb_id, 
//         re.amount, 
//         re.submitted, 
//         re.resolved,
//         re.description,
//         re.reciept,
//         ur.name as role_name
//     from ers_reimbursements re
//     join ers_reimb_statuses rs
//     on re.reimb_status_id = rs.reimb_status_id
//     join ers_reimb_types rt
//     on re.reimb_type_id = rt.reimb_type_id`;
//     /**
//      * Gets all Reimb
//      * @returns reimb[]
//      */
//     async getAll(): Promise<Reimb[]> {
//         let client: PoolClient;
//         try {
//             client = await connectionPool.connect();
//             let sql = "SELECT * FROM reimbs";
//             let rs = await client.query(sql);
//             return rs.rows.map(mapReimbResultSet);
//         } catch (e) {
//             throw new InternalServerError();
//         } finally {
//             client && client.release();
//         }
//     };

//     getById(id: number): Promise<Reimb> {

//         return new Promise<Reimb>((resolve, reject) => {
//             if (typeof id !== 'number' || !Number.isInteger(id) || id <= 0) {
//                 reject(new BadRequestError());
//                 return;
//             }

//             setTimeout(function () {

//                 const post: Reimb = { ...data.filter(post => post.id === id).pop() };

//                 if (!post) {
//                     reject(new ResourceNotFoundError());
//                     return;
//                 }

//                 resolve(post);

//             }, 250);

//         });
//     }

//     save(newReimb: Reimb): Promise<Reimb> {
//         return new Promise<Reimb>((resolve, reject) => {
//             reject(new NotImplementedError());
//         });
//     }

//     update(updatedReimb: Reimb): Promise<boolean> {
//         return new Promise<boolean>((resolve, reject) => {
//             reject(new NotImplementedError());
//         });
//     }

//     deleteById(id: number): Promise<boolean> {
//         return new Promise<boolean>((resolve, reject) => {
//             reject(new NotImplementedError());
//         });
//     }

//     getReimbsByReimberId(pid: number): Promise<Reimb[]> {
//         return new Promise<Reimb[]>((resolve, reject) => {

//             if (typeof pid !== 'number' || !Number.isInteger(pid) || pid <= 0) {
//                 reject(new BadRequestError());
//                 return;
//             }

//             setTimeout(function () {
//                 const posts = data.filter(post => post.posterId == pid);
//                 resolve(posts);
//             }, 250);

//         });
//     }
// }
