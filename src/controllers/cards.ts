import express from 'express';
import {
    getCards,
    getCardByUid,
    createCard,
    deleteCardByUid,
    updateCardByUid,
} from '../db/cards';

export const getAllCards = async (req: express.Request, res: express.Response) => {
    try {
        const cards = await getCards();

        return res.status(200).json(cards);
    } catch (error) {
        console.log(error);
        return res.sendStatus(400);
    }
};

export const getCard = async (req: express.Request, res: express.Response) => {
    try {
        const { uid } = req.params;

        const card = await getCardByUid(Number(uid));

        if (!card) {
            return res.sendStatus(404);
        }

        return res.status(200).json(card);
    } catch (error) {
        console.log(error);
        return res.sendStatus(400);
    }
};

export const createCardController = async (req: express.Request, res: express.Response) => {
    try {
        const { uid, bal } = req.body;

        if (!uid || !bal) {
            return res.sendStatus(400);
        }


        const existingCard = await getCardByUid(uid);

        if (existingCard) {
            return res.sendStatus(400);
        }

        const newCard = await createCard({
            uid,
            bal,
        });

        return res.status(201).json(newCard);
    } catch (error) {
        console.error('Error creating card:', error);
        return res.sendStatus(500);
    }
};
export const deleteCard = async (req: express.Request, res: express.Response) => {
    try {
        const { uid } = req.params;

        const deletedCard = await deleteCardByUid(Number(uid));

        if (!deletedCard) {
            return res.sendStatus(404);
        }

        return res.json(deletedCard);
    } catch (error) {
        console.log(error);
        return res.sendStatus(400);
    }
};

export const updateCard = async (req: express.Request, res: express.Response) => {
    try {
        const { uid } = req.params;
        const { bal } = req.body;

        if (!bal) {
            return res.sendStatus(400);
        }

        const card = await updateCardByUid(Number(uid), { bal });

        if (!card) {
            return res.sendStatus(404);
        }

        return res.status(200).json(card);
    } catch (error) {
        console.log(error);
        return res.sendStatus(400);
    }
};
