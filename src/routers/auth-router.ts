import express from 'express';
import AppConfig from '../config/app';
import { Principal } from '../dtos/principal';

export const AuthRouter = express.Router();

const userService = AppConfig.userService;

AuthRouter.get('', (req, res) => {
    delete req.session.principal;
    res.status(204).send();
});

AuthRouter.post('', async (req, res) => {

    try {
        const username = req.body.username;
        const userpassword = req.body.userpassword;
        let authUser = await userService.authenticateUser(username, userpassword);
        
        let payload = new Principal(authUser.ers_user_id, authUser.username, authUser.role_name);
        req.session.principal = payload;
        res.status(200).json(payload);
        
    } catch (e) {
        res.status(e.statusCode || 500).json(e);
    }

    res.send();

});

AuthRouter.get('', async (req,res) => {
    delete req.session.principal;
    res.status(204).send();
});