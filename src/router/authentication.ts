import express from 'express';

import { login, register } from '../controllers/authentication';
import { soleAuth } from '../middlewares';

export default (router: express.Router) => {
    router.post('/auth/register', register);
    router.post('/auth/login', login);
    router.get('/auth/soleAuth', soleAuth)
}