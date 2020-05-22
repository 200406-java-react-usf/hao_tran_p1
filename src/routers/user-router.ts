import express from 'express';
import AppConfig from '../config/app';
import url from 'url';
import { isEmptyObject } from '../util/validator';
import { ParsedUrlQuery } from 'querystring';
import { User } from '../models/user';
import { adminGuard } from '../middleware/admin-middleware';


export const UserRouter = express.Router();

const userService = AppConfig.userService;

UserRouter.get('/all', async (req, res) => {
    try {
        let payload = await userService.getAllUsers();
        res.status(200).json(payload);
    } catch (e) {
        res.status(400).json(e);
    }
});
//search
UserRouter.get('', async (req, res) => {

    try {

        let reqURL = url.parse(req.url, true);

        if (!isEmptyObject<ParsedUrlQuery>(reqURL.query)) {
            let payload = await userService.getUserByUniqueKey({ ...reqURL.query });
            res.status(200).json(payload);
        } else {
            let payload = await userService.getAllUsers();
            res.status(200).json(payload);
        }

    } catch (e) {
        res.status(e.statusCode).json(e);
    }

});
//update
UserRouter.post('/update', async (req, res) => {
    
    try {

        let update: User = req.body;
        if (!isEmptyObject(req.body)) {
            let payload = await userService.updateUser(update);
            res.status(200).json(payload);
        } else {
            let payload = await userService.getAllUsers();
            res.status(200).json(payload);
        }

    } catch (e) {
        res.status(e.statusCode).json(e);
    }

});

//new
UserRouter.post('/new', async (req, res) => {

    try {
        let newUser: User = req.body;
        if (!isEmptyObject(req.body)) {
            let payload = await userService.addNewUser(newUser);
            res.status(200).json(payload);
        } else {
            let payload = await userService.getAllUsers();
            res.status(200).json(payload);
        }

    } catch (e) {
        res.status(e.statusCode).json(e);
    }

});

//new
UserRouter.delete('/:id', async (req, res) => {
    let id = +req.params.id;
    try {

        let payload = await userService.deleteById(id);
        res.status(200).json(payload);

    } catch (e) {
        res.status(e.statusCode).json(e);
    }

});