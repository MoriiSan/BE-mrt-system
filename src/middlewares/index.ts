import express from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';
import { get, merge } from 'lodash';

import { getUserBySessionToken } from '../db/users';
import { getCards } from '../db/cards';
import { FareModel } from '../db/fare';

export const isOwner = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    try {
        const { id } = req.params;
        const currentUserId = get(req, 'identity._id') as string;

        if (!currentUserId) {
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
        // console.log('received token', token)
        if (!token) {
            return res.status(403).send({ message: `Invalid token. Log in again.` });
        }

        const decoded = jwt.verify(token, process.env.SECRET_KEY) as JwtPayload;

        const currentTimestamp = Math.floor(Date.now() / 1800); //30 minutes

        if (decoded.exp && currentTimestamp > decoded.exp) {
            return res.status(401).send({ message: `Token has expired` });
        }

        const existingUser = await getUserBySessionToken(token);
        if (!existingUser) {
            return res.sendStatus(403);
        }

        merge(req, { identity: existingUser });
        // console.log('TOKEN VERIFIED')
        next();
    } catch (error) {
        console.log(error);
        if (error instanceof jwt.JsonWebTokenError) {
            return res.status(403).send({ message: `Invalid token. Log in again.` });
        }
        return res.sendStatus(400);
    }
};

export const isMaintenance = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    try {
        const card = await getCards();
        const tapState = card.some(card => !!card.tapState);
        if (tapState) {
            return res.status(400).json({ message: 'Maintenance not allowed while may tao.' });
        }

        const config = await FareModel.findOne({ fareId: 1 });
        if (!config.isMaintenance) {
            return res.status(400).json({ message: 'System is in operational mode. Please try again later.' });
        }

        next();
    } catch (error) {
        console.log(error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
}

export const isOperational = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    try {
        const config = await FareModel.findOne({ fareId: 1 });
        // console.log(config.isMaintenance)
        if (config.isMaintenance) {
            return res.status(400).json({ message: 'System is in maintenance mode. Please try again later.' });
        }

        next();
    } catch (error) {
        console.log(error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
}

export const soleAuth = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    try {
        const token = req.headers['authorization'];
        // console.log('received soleAuth token', token)
        if (!token) {
            return res.status(403).send({ message: `Invalid token` });
        }

        const decoded = jwt.verify(token, process.env.SECRET_KEY) as JwtPayload;

        const currentTimestamp = Math.floor(Date.now() / 1800); //30 minutes

        if (decoded.exp && currentTimestamp > decoded.exp) {
            return res.status(401).send({ message: `Token has expired` });
        }

        const existingUser = await getUserBySessionToken(token);
        if (!existingUser) {
            return res.sendStatus(403);
        }

        merge(req, { identity: existingUser });

        return res.sendStatus(200);
    } catch (error) {
        console.log(error);
        if (error instanceof jwt.JsonWebTokenError) {
            return res.sendStatus(403);
        }
        return res.sendStatus(400);
    }
};