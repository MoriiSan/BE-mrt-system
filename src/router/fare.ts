import express from 'express';

import {
    getMrtFare,
    updateMrtFare,
    toggleMaintenance,
    getMode
} from '../controllers/adminConfig';
import { isMaintenance, isAuthenticated } from '../middlewares';


export default (router: express.Router) => {
    router.get('/adminConfigs/fare', getMrtFare);
    router.get(`/adminConfigs/mode-setting`, getMode)
    router.patch('/adminConfigs/:fareId', isMaintenance, isAuthenticated, updateMrtFare)
    router.patch('/adminConfigs/maintenance/toggle', toggleMaintenance)
};
