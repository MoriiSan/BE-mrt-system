import express from 'express';

import {
    getAllStations,
    getStation,
    createAStation,
    deleteStation,
    updateStation,
    traveledDistance,
    getRoute,
} from '../controllers/stations';
import { isMaintenance, isAuthenticated } from '../middlewares';



export default (router: express.Router) => {
    router.get('/stations', getAllStations);
    router.get('/stations/:id', getStation);
    router.post('/stations/create-station',isAuthenticated, isMaintenance, createAStation);
    router.patch('/stations/update-station/:_id',isAuthenticated, isMaintenance, updateStation);
    router.delete('/stations/delete-station/:stationName',isAuthenticated, isMaintenance, deleteStation);
    router.post('/stations/traveled-distance', traveledDistance);
    router.post(`/stations/get-route`, getRoute);
};
