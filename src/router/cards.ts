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
    updateLogs
} from '../controllers/cards';
import { isMaintenance, isOperational } from '../middlewares';



export default (router: express.Router) => {
    router.get('/cards', getAllCards);
    router.get('/cards/:uid', getCard);
    router.get('/cards/linkedCards/:devId',getLinkedCards)
    router.patch('/cards/linkCard/:uid', linkCard);
    router.patch('/cards/updateLogs/:uid', updateLogs);

    router.post('/cards/creating-card', createCardController);
    router.delete('/cards/:uid', deleteCard);
    router.patch('/cards/:uid', updateCard);
    router.patch('/cards/tapIn/:uid', isOperational, tapIn)
    router.patch('/cards/tapOut/:uid', isOperational, tapOut)
};
