import express from 'express';
import AppConfig from '../config/app';

export const UserRouter = express.Router();

const userService = AppConfig.userService;

UserRouter.get('', async (req, res) => {
    try {
        let payload = await userService.getAllUsers();
        res.status(200).json(payload);
    } catch (e) {
        res.status(400).json(e);
    }
});
