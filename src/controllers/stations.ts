import express from 'express';
import { Graph } from 'graphlib';
import * as graphlib from 'graphlib';
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
        const { id } = req.params;
        // console.log("Requested station id:", id);

        const station = await StationModel.findOne({ _id: id });
        // console.log("Retrieved station:", station);

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
                // console.log(reference.stationConn[i], reference.stationName)
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


// POLYLINES ////////////


export const haversine = (
    lat1: number,
    lng1: number,
    lat2: number,
    lng2: number
) => {
    const R = 6371; // Radius of the Earth in kilometers
    const dLat = (lat2 - lat1) * (Math.PI / 180);
    const dLon = (lng2 - lng1) * (Math.PI / 180);
    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(lat1 * (Math.PI / 180)) *
        Math.cos(lat2 * (Math.PI / 180)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c; // Distance in kilometers
    return distance;
};

export const traveledDistance = async (req: express.Request, res: express.Response) => {
    const initialStation = req.body.initialStation;
    const finalStation = req.body.finalStation;

    try {
        const stations = await getStations(); // Fetch stations asynchronously
        if (!stations || stations.length === 0) {
            return res.status(400).json({ message: "Stations not found" });
        }

        const graph = new graphlib.Graph({ directed: true });

        // Add nodes (stations) to the graph
        stations.forEach(station => {
            if (station.stationName) {
                graph.setNode(station.stationName);
            }
        });

        // Add edges (connections) to the graph
        stations.forEach(station => {
            if (station.stationName && station.stationCoord) {
                station.stationCoord.forEach(connection => {
                    graph.setEdge(station.stationName, connection.toString());
                });
            }
        });

        // Calculate distances and set as edge weights
        graph.edges().forEach((edge: { v: any; w: any; }) => {
            const sourceNode = edge.v;
            const targetNode = edge.w;
            const sourceStation = stations.find(station => station.stationName === sourceNode);
            const targetStation = stations.find(station => station.stationName === targetNode);
            if (sourceStation && targetStation && sourceStation.stationCoord && targetStation.stationCoord) {
                const dist = haversine(sourceStation.stationCoord[0], sourceStation.stationCoord[1], targetStation.stationCoord[0], targetStation.stationCoord[1]);
                graph.setEdge(sourceNode, targetNode, { distance: dist / 1000 });
            }
        });

        // Use Dijkstra's algorithm to find shortest path
        const shortestPath = graphlib.alg.dijkstra(graph, initialStation, (edge) => {
            return graph.edge(edge).distance;
        });

        const dist = shortestPath[finalStation].distance;
        console.log('Distance is', dist);
        return res.status(200).json({ distance: dist });

    } catch (error) {
        console.error('Error:', error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
};

export const getRoute = async (req: express.Request, res: express.Response) => {
    const initialStation = req.body.initialStation;
    const finalStation = req.body.finalStation;
    try {
        const graph = new graphlib.Graph({ directed: true });
        const stations = await getStations()
        if (stations) {
            stations.forEach(station => {
                if (station.stationName) {
                    graph.setNode(station.stationName);
                }
            });

            // Add edges (connections) to the graph
            stations.forEach(station => {
                if (station.stationConn) {
                    station.stationConn.forEach(connection => {
                        if (station.stationName) {
                            graph.setEdge(station.stationName, connection);
                        }
                    });
                }
            });
        }
        const path = graphlib.alg.dijkstra(graph, initialStation);
        // console.log(inStation, outStation)
        const nodesTraversed = [];
        let currentNode = finalStation;
        while (currentNode !== initialStation) {
            nodesTraversed.unshift(currentNode);
            currentNode = path[currentNode].predecessor;
            if (!currentNode) {
                // If no path exists between inStation and outStation
                return res.status(400).json({ message: 'No path exists between the given stations.' });
            }
        }
        nodesTraversed.unshift(initialStation); // Add the starting node
        nodesTraversed.push(finalStation); // Add the final node
        return res.status(200).json(nodesTraversed);
    } catch (error) {
        console.log(error)
        return res.status(400).json({ message: error });
    }
}