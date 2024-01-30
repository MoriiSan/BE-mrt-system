import express from 'express';

import authentication from './authentication';
import users from './users';
import cards from './cards';
import fare from './fare';
import stations from './stations';

const router = express.Router();

export default (): express.Router => {
    authentication(router);
    users(router);
    cards(router);
    fare(router);
    stations(router);
    return router;
};