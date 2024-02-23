import express from 'express';
import {
    FareModel,
    getFare,
    updateFare
} from '../db/fare';

export const getMrtFare = async (req: express.Request, res: express.Response) => {
    try {
        const getFare = await FareModel.findOne({fareId: 1});

        return res.status(200).json(getFare.fareKm);
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

export const toggleMaintenance = async (req: express.Request, res: express.Response) => {
    try {
        const config = await FareModel.findOne({ fareId: 1 });

        if (config.isMaintenance) {
            // If currently in maintenance mode, switch to operational mode
            await FareModel.updateOne({ fareId: 1 }, { $set: { isMaintenance: false, isOperational: true } });
            return res.status(200).json({ message: 'Switched to operational mode' });
        } else {
            // If currently in operational mode, switch to maintenance mode
            await FareModel.updateOne({ fareId: 1 }, { $set: { isMaintenance: true, isOperational: false } });
            return res.status(200).json({ message: 'Switched to maintenance mode' });
        }
  
    } catch (error) {
        console.log(error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
}
