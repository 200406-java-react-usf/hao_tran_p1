import express from 'express';
import AppConfig from '../config/app';
import url from 'url';
import { isEmptyObject } from '../util/validator';
import { ParsedUrlQuery } from 'querystring';

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

UserRouter.get('', async (req, resp) => {

    try {

        let reqURL = url.parse(req.url, true);

        if(!isEmptyObject<ParsedUrlQuery>(reqURL.query)) {
            let payload = await userService.getUserByUniqueKey({...reqURL.query});
            resp.status(200).json(payload);
        } else {
            let payload = await userService.getAllUsers();
            resp.status(200).json(payload);
        }

    } catch (e) {
        resp.status(e.statusCode).json(e);
    }

});