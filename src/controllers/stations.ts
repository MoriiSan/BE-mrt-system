import express from 'express';
import {
    getStations,
    getStationByName,
    createStation,
    deleteStationByName,
    updateStationByName,
} from '../db/stations';

export const getAllStations = async (req: express.Request, res: express.Response) => {
    try {
        const stations = await getStations();

        return res.status(200).json(stations);
    } catch (error) {
        console.log(error);
        return res.sendStatus(400);
    }
};

export const getStation = async (req: express.Request, res: express.Response) => {
    try {
        const { shortName } = req.params;

        const station = await getStationByName(shortName);

        if (!station) {
            return res.sendStatus(404);
        }
        return res.status(200).json(station);
    } catch (error) {
        console.log(error);
        return res.sendStatus(400);
    }
};

export const createAStation = async (req: express.Request, res: express.Response) => {
    try {
        const { shortName,
            stationName,
            stationCoord,
            stationConn } = req.body;

        if (!shortName || !stationName || !stationCoord || !stationConn) {
            return res.sendStatus(400);
        }

        const existingStation = await getStationByName(shortName);

        if (existingStation) {
            return res.sendStatus(400);
        }

        const newStation = await createStation({
            shortName,
            stationName,
            stationCoord,
            stationConn
        });

        return res.status(201).json(newStation);
    } catch (error) {
        console.error('Error creating station:', error);
        return res.sendStatus(500);
    }
};

export const deleteStation = async (req: express.Request, res: express.Response) => {
    try {
        const { shortName } = req.params;

        const deletedStation = await deleteStationByName(shortName);

        if (!deletedStation) {
            return res.sendStatus(404);
        }

        return res.json(deletedStation);
    } catch (error) {
        console.log(error);
        return res.sendStatus(400);
    }
};

export const updateStation = async (req: express.Request, res: express.Response) => {
    try {
        const { shortName } = req.params;
        const [stationCoord] = req.body;
        const { stationConn } = req.body;

        if (!stationCoord || !stationConn) {
            return res.sendStatus(400);
        }

        const station = await updateStationByName((shortName), {stationCoord, stationConn});

        if (!station) {
            return res.sendStatus(404);
        }

        return res.status(200).json(station);
    } catch (error) {
        console.log(error);
        return res.sendStatus(400);
    }
};