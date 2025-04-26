import express from 'express';

import {
    getAllCards,
    getCard,
    createCardController,
    deleteCard,
    updateCard,
    tapIn,
    tapOut,
    linkCard,
    getLinkedCards,
    removeLinkedCard,
    updateLogs,
    removeAllCards,
} from '../controllers/cards';
import { isMaintenance, isOperational, isAuthenticated } from '../middlewares';

export default (router: express.Router) => {
    router.get('/cards', getAllCards);
    router.get('/cards/:uid', getCard);
    router.post('/cards/creating-card', isAuthenticated, createCardController);
    router.delete('/cards/:uid', isAuthenticated, deleteCard);
    router.patch('/cards/update-card/:uid', isAuthenticated, updateCard);
    router.patch('/cards/tapIn/:uid', isOperational, tapIn)
    router.patch('/cards/tapOut/:uid', isOperational, tapOut)
    // router.patch('/cards/updateLogs/:uid', updateLogs);
    router.patch('/cards/user-update-card/:uid', updateLogs);


    router.get('/cards/linkedCards/:devId', getLinkedCards)
    router.patch('/cards/linkCard/:uid', linkCard);
    router.patch('/cards/remove-card/:uid', removeLinkedCard)
    router.patch('/cards/remove-all-cards/:devId', removeAllCards)

};
