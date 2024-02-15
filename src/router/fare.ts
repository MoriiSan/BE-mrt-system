import express from 'express';

import {
    getMrtFare,
    updateMrtFare,
} from '../controllers/fare';

export default (router: express.Router) => {
    router.get('/adminConfigs/:fareId', getMrtFare);
    router.patch('/adminConfigs/:fareId', updateMrtFare)
};
