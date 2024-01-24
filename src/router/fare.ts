import express from 'express';

import {
    getMrtFare,
    updateMrtFare,
} from '../controllers/fare';

export default (router: express.Router) => {
    router.get('/adminConfigs/fare', getMrtFare);
    router.patch('/adminConfigs/:fare', updateMrtFare);
};
