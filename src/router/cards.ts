import express from 'express';

import {
    getAllCards,
    getCard,
    createCardController,
    deleteCard,
    updateCard,
    tapIn,
    tapOut
} from '../controllers/cards';

export default (router: express.Router) => {
    router.get('/cards', getAllCards);
    router.get('/cards/:uid', getCard);
    
    router.post('/cards/creating-card', createCardController);
    router.delete('/cards/:uid', deleteCard);
    router.patch('/cards/:uid', updateCard);
    router.patch('/cards/tapIn/:uid', tapIn)
    router.patch('/cards/tapOut/:uid', tapOut)
};
