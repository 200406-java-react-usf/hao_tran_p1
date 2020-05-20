import express from 'express';
import AppConfig from '../config/app';
import url from 'url';
import { isEmptyObject } from '../util/validator';
import { ParsedUrlQuery } from 'querystring';
import { User } from '../models/user';

export const UserRouter = express.Router();

const userService = AppConfig.userService;

UserRouter.get('/all', async (req, res) => {
    console.log("hit users")

    try {
        let payload = await userService.getAllUsers();
        res.status(200).json(payload);
    } catch (e) {
        res.status(400).json(e);
    }
});
//search
UserRouter.get('', async (req, resp) => {

    try {

        let reqURL = url.parse(req.url, true);

        if (!isEmptyObject<ParsedUrlQuery>(reqURL.query)) {
            let payload = await userService.getUserByUniqueKey({ ...reqURL.query });
            resp.status(200).json(payload);
        } else {
            let payload = await userService.getAllUsers();
            resp.status(200).json(payload);
        }

    } catch (e) {
        resp.status(e.statusCode).json(e);
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
    let id = +req.params.id
    console.log("hit delete " + id)

    try {

        let payload = await userService.deleteById(id);
        res.status(200).json(payload);

    } catch (e) {
        res.status(e.statusCode).json(e);
    }

});