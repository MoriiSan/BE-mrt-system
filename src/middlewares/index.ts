import express from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';
import { get, merge } from 'lodash';

import { getUserBySessionToken } from '../db/users';

export const isOwner = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    try {
        const { id } = req.params;
        const currentUserId = get(req, 'identity._id') as string;

        if(!currentUserId) {
            return res.sendStatus(403);
        }

        if (currentUserId.toString() !== id) {
            return res.sendStatus(403);
        }

        next();
    } catch (error) {
        console.log(error);
        return res.sendStatus(400);
    }
};

export const isAuthenticated = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    try {
        const token = req.headers['authorization'];

        if (!token){
            return res.sendStatus(403);
        }

        const decoded = jwt.verify(token, 'secretKey') as JwtPayload;

        const currentTimestamp = Math.floor(Date.now() / 1000);
        if (decoded.exp && currentTimestamp > decoded.exp) {
            return res.sendStatus(401).json('Token has expired');
        }

        const existingUser = await getUserBySessionToken(token);
        if (!existingUser) {
            return res.sendStatus(403);
        }

        merge(req, {identity: existingUser});

        next();
    } catch (error) {
        console.log(error);
        if (error instanceof jwt.JsonWebTokenError) {
            return res.sendStatus(403);
        }
        return res.sendStatus(400);
    }
};