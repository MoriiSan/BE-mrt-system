import express from 'express';

import {
    getMrtFare,
    updateMrtFare,
    toggleMaintenance
} from '../controllers/adminConfig';
import { isMaintenance } from '../middlewares';


export default (router: express.Router) => {
    router.get('/adminConfigs/fare', getMrtFare);
    router.patch('/adminConfigs/:fareId',isMaintenance, updateMrtFare)
    router.patch('/adminConfigs/maintenance/toggle', toggleMaintenance)
};
