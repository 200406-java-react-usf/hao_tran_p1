import { Request, Response } from "express";


export function corsFilter(req: Request, res: Response, next) {

    res.header('Access-Control-Allow-Origin', '*'); 
    res.header('Access-Control-Allow-Headers', 'Origin, Content-Type, Accept');
    res.header('Access-Control-Allow-Credentials', 'true');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE');

    // If this request is an OPTION request (aka "pre-flight request") send it back with a status of 200
    if (req.method === 'OPTIONS') {
        res.sendStatus(200);
    } else {
        next(); // passes the req and res objects to the next piece of middleware (or router).
    }


}