import express from 'express';
import {
    getFare,
    updateFare
} from '../db/fare';

export const getMrtFare = async (req: express.Request, res: express.Response) => {
    try {
        const adminConfigs = await getFare();
        console.log(adminConfigs)

        return res.status(200).send(adminConfigs);
    } catch (error) {
        console.log(error);
        return res.sendStatus(400);
    }
};

export const updateMrtFare = async (req: express.Request, res: express.Response) => {
    try {
        const { fareId } = req.params;
        const { fareKm } = req.body;

        if (!fareKm) {
            return res.sendStatus(400);
        }

        const fare = await updateFare(Number(fareId), { fareKm });

        if (!fare) {
            return res.sendStatus(404);
        }

        return res.status(200).json(fare);
    } catch (error) {
        console.log(error);
        return res.sendStatus(400);
    }
};
