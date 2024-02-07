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
        const {
            stationName,
            stationCoord,
            stationConn } = req.body;

        if (!stationName || !stationCoord || !stationConn) {
            return res.sendStatus(400);
        }


        const existingStation = await getStationByName(stationName || stationCoord);
        if (existingStation) {
            return res.status(400).send({ message: `Already Exist` });
        }

        //check if connections exist
        for (let i = 0; i < stationConn.length; i++) {
            const checkExist = await StationModel.findOne({ stationName: stationConn[i] })
            if (!checkExist) {
                return res.status(400).send({ message: `${stationConn[i]} Connection Does Not Exist!` });
            }
        }

        //create connection on connections
        for (let i = 0; i < stationConn.length; i++) {
            const UpdateConnection = await StationModel.findOneAndUpdate(
                { stationName: stationConn[i] },
                { $push: { stationConn: stationName } },
                { new: true }
            )
        }

        // create the station
        const stationNew = await createStation({
            stationName: stationName,
            stationCoord: stationCoord,
            stationConn: stationConn
        })

        return res.status(200).send({ message: "Station created successfully!" })

    } catch (error) {
        console.log(error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
};

export const updateStation = async (req: express.Request, res: express.Response) => {
    try {
        const id = req.params._id;
        const { stationName, stationCoord, stationConn } = req.body;

        if (!stationCoord || !stationConn || !stationName) {
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
                    { stationName: reference.stationName[i] },
                    { $pull: { stationConn: reference.stationName } },
                    { new: true }
                )
            }
        }

        //check if all values are the saem
        if (reference.stationName === stationName &&
            JSON.stringify(reference.stationCoord) === JSON.stringify(stationCoord) &&
            JSON.stringify(reference.stationConn) === JSON.stringify(stationConn)) {
            return res.status(400).send({ message: `No Changes Found` });
        }

        //check for multiple data
        const findDupe = await StationModel.find({
            $or: [
                { stationName: stationName },
                { coordinates: stationCoord }
            ]
        });
        if (findDupe.length > 1) {
            return res.status(400).send({ message: 'Information Contains Data that Already Exists' });
        }

        //check if connections exist
        for (let i = 0; i < stationConn.length; i++) {
            const checkExist = await StationModel.findOne({ stationName: stationConn[i] })
            if (!checkExist) {
                return res.status(400).send({ message: `${stationConn[i]} Connection Does Not Exist!` });
            }
        }

        //check if it is trying to connect to itself
        for (let i = 0; i < stationConn.length; i++) {
            if (stationConn[i] == reference.stationName || stationConn[i] == stationName) {
                return res.status(400).send({ message: `Cannot Connect to Own Station` });
            }
        }

        //check if stationName has been modified and remove connectionName
        if (stationName != reference.stationName || stationConn != reference.stationConn) {
            if (reference.stationConn) {
                for (let i = 0; i < reference.stationConn.length; i++) {
                    await StationModel.findOneAndUpdate(
                        { stationName: reference.stationConn[i] },
                        { $pull: { stationConn: reference.stationName } },
                        { new: true }
                    )
                }
            }
        }

        // create connection on connections
        for (let i = 0; i < stationConn.length; i++) {
            await StationModel.findOneAndUpdate(
                { stationName: stationConn[i] },
                { $push: { stationConn: stationName } },
                { new: true }
            )
        }

        // update station
        const update = await StationModel.findByIdAndUpdate(
            { _id: id },
            {
                stationName: stationName,
                stationCoord: stationCoord,
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
        const { stationName } = req.params;

        const reference = await StationModel.findOneAndDelete({ stationName: stationName });

        //remove deleted station from connections of other data
        if (reference.stationConn) {
            for (let i = 0; i < reference.stationConn.length; i++) {
                console.log(reference.stationConn[i], reference.stationName)
                const clear = await StationModel.findOneAndUpdate(
                    { stationName: reference.stationConn[i] },
                    { $pull: { stationConn: reference.stationName } },
                    { new: true }
                )
            }
        }
        return res.status(200).send({ message: 'Successfully Deleted', reference })

    } catch (error) {
        console.log(error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
};
