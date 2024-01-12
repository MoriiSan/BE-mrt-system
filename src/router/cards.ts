import express from 'express';

import {
    getAllCards,
    getCard,
    createCardController,
    deleteCard,
    updateCard,
} from '../controllers/cards';

export default (router: express.Router) => {
    router.get('/cards', getAllCards);
    router.get('/cards/:uid', getCard);
    router.post('/cards', createCardController);
    router.delete('/cards/:uid', deleteCard);
    router.patch('/cards/:uid', updateCard);
};
