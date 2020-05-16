import url from 'url';
import express from 'express';
import AppConfig from '../config/app';
import { isEmptyObject } from '../util/validator';
import { ParsedUrlQuery } from 'querystring';
import { adminGuard } from '../middleware/auth-middleware';

export const ReimbRouter = express.Router();

const reimbService = AppConfig.reimbService;

/**
  * get all reimbs
  * for testing
  */
ReimbRouter.get('/allreimb', adminGuard, async (req, res) => {

    try {

        let reqURL = url.parse(req.url, true);

        if (!isEmptyObject<ParsedUrlQuery>(reqURL.query)) {
            let payload = await reimbService.getReimbByUniqueKey({ ...reqURL.query });
            res.status(200).json(payload);
        } else {
            let payload = await reimbService.getAllReimbs();
            res.status(200).json(payload);
        }

    } catch (e) {
        res.status(e.statusCode).json(e);
    }

});

/**
  * get 1 reimb
  * for testing
  */
ReimbRouter.get('/:id', async (req, res) => {
    const id = +req.params.id;
    try {
        let payload = await reimbService.getReimbById(id);
        res.status(200).json(payload);
    } catch (e) {
        res.status(e.statusCode).json(e);
    }
});

/**
  * get 1 reimb
  * for testing
  */
 ReimbRouter.get('/', async (req, res) => {
    let query = req.body.data;
    try {
        let payload = await reimbService.getReimbByUniqueKey(query);
        res.status(200).json(payload);
    } catch (e) {
        res.status(e.statusCode).json(e);
    }
});

ReimbRouter.post('', async (req, res) => {

    console.log('POST REQUEST RECEIVED AT /reimbs');
    console.log(req.body);
    try {
        let newReimb = await reimbService.addNewReimb(req.body);
        res.status(201).json(newReimb);
    } catch (e) {
        res.status(e.statusCode).json(e);
    }

});
