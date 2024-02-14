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

export default (router: express.Router) => {
    router.get('/stations', getAllStations);
    router.get('/stations/:id', getStation);
    router.post('/stations/create-station', createAStation);
    router.patch('/stations/update-station/:_id', updateStation);
    router.delete('/stations/delete-station/:stationName', deleteStation);    
    router.get(`/stations/traveled-distance`, traveledDistance);
    router.get(`/stations/get-route`, getRoute);
};
