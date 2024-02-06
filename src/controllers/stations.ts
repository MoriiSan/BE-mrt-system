import express from 'express';
import {
    getStations,
    getStationByName,
    createStation,
    deleteStationByName,
    updateStationById,
    addStationConnsByName,
    StationModel,
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

        const existingStation = await getStationByName(shortName || stationName || stationCoord);

        if (existingStation) {
            return res.status(400).send({ message: `Already Exist` });
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

export const updateStation = async (req: express.Request, res: express.Response) => {
    try {
        const id = req.params._id;
        const { shortName, stationName, stationCoord, stationConn } = req.body;

        console.log(id, shortName, stationName)
        if (!stationCoord || !stationConn || !stationName || !shortName) {
            return res.sendStatus(400);
        }

        const station = await StationModel.findById({ _id: id });

        if (!station) {
            return res.sendStatus(404);
        }

        const reference = await StationModel.findById({ _id: id })

        //delete connections to all
        if (reference.stationConn) {
            for (let i = 0; i < reference.stationConn.length; i++) {
                await StationModel.findOneAndUpdate(
                    { shortName: reference.shortName[i] },
                    { $pull: { stationConn: reference.shortName } },
                    { new: true }
                )
            }
        }

        //check if all values are the saem
        if (reference.stationName === stationName &&
            reference.shortName === shortName &&
            JSON.stringify(reference.stationCoord) === JSON.stringify(stationCoord) &&
            JSON.stringify(reference.stationConn) === JSON.stringify(stationConn)) {
            return res.status(400).send({ message: `No Changes Found` });
        }

        //check for multiple data
        const findDupe = await StationModel.find({
            $or: [
                { stationName: stationName },
                { shortName: shortName },
                { coordinates: stationCoord }
            ]
        });
        if (findDupe.length > 1) {
            return res.status(400).send({ message: 'Information Contains Data that Already Exists' });
        }

        //check if connections exist
        for (let i = 0; i < stationConn.length; i++) {
            const checkExist = await StationModel.findOne({ shortName: stationConn[i] })
            if (!checkExist) {
                return res.status(400).send({ message: `${stationConn[i]} Connection Does Not Exist!` });
            }
        }

        //check if it is trying to connect to itself
        for (let i = 0; i < stationConn.length; i++) {
            if (stationConn[i] == reference.shortName || stationConn[i] == shortName) {
                return res.status(400).send({ message: `Cannot Connect to Own Station` });
            }
        }

        //check if stationShortName has been modified and remove connectionName
        if (shortName != reference.shortName || stationConn != reference.stationConn) {
            if (reference.stationConn) {
                for (let i = 0; i < reference.stationConn.length; i++) {
                    await StationModel.findOneAndUpdate(
                        { shortName: reference.stationConn[i] },
                        { $pull: { stationConn: reference.shortName } },
                        { new: true }
                    )
                }
            }
        }

        // create connection on connections
        for (let i = 0; i < stationConn.length; i++) {
            await StationModel.findOneAndUpdate(
                { shortName: stationConn[i] },
                { $push: { stationConn: shortName } },
                { new: true }
            )
        }

        // update station
        const update = await StationModel.findByIdAndUpdate(
            { _id: id },
            {
                stationName: stationName,
                stationCoord: stationCoord,
                shortName: shortName,
                stationConn: stationConn
            },
            { new: true }
        )

        return res.status(200).json({ update, message: 'Station Updated Successfuly' });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
}

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

export const AddStationConns = async (req: express.Request, res: express.Response) => {
    try {
        const { shortName } = req.params;
        const { stationConn } = req.body;

        const station = await getStationByName(shortName);

        if (!station) {
            return res.sendStatus(404);
        }
        if (station.stationConn.includes(stationConn)) {
            return res.sendStatus(400)
        }

        const addStationConn = await addStationConnsByName(shortName, { stationConn });

        if (!addStationConn) {
            return res.sendStatus(404);
        }

        return res.status(200).json(station);
    } catch (error) {
        console.log(error);
        return res.sendStatus(400);
    }
};