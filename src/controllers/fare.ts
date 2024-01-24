import express from 'express';
import {
    getFare,
    updateFare
} from '../db/fare';

export const getMrtFare = async (req: express.Request, res: express.Response) => {
    try {
        const adminConfigs = await getFare();

        return res.status(200).json(adminConfigs);
    } catch (error) {
        console.log(error);
        return res.sendStatus(400);
    }
};


export const updateMrtFare = async (req: express.Request, res: express.Response) => {
    try {
        const { fare } = req.params;


        if (!fare) {
            return res.sendStatus(400);
        }

        const adminConfigs = await updateFare(Number(fare));

        if (!adminConfigs) {
            return res.sendStatus(404);
        }

        return res.status(200).json(adminConfigs);
    } catch (error) {
        console.log(error);
        return res.sendStatus(400);
    }
};
