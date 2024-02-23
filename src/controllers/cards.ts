import express from 'express';
import {
    getCards,
    getCardByUid,
    createCard,
    deleteCardByUid,
    updateCardByUid,
    CardModel,
} from '../db/cards';
import { FareModel } from '../db/fare';

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
            return res.status(404).send({ message: `Card does not exist` });
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
        const tapState = ''
        if (!uid) {
            return res.sendStatus(400);
        }

        const existingCard = await getCardByUid(uid);

        if (existingCard) {
            return res.sendStatus(400);
        }

        const newCard = await createCard({
            uid,
            bal,
            tapState
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

export const tapIn = async (req: express.Request, res: express.Response) => {
    try {
        const { uid } = req.params;
        const { tapState } = req.body;

        const card = await getCardByUid(Number(uid));
        const fare = await FareModel.findOne({ fareId: 1 })

        if (!card) {
            return res.status(404).send({ message: `Card does not exist` });
        }

        if (card.tapState.trim() !== '') {
            return res.status(400).send({ message: 'No Exit' })
        }
        if (card.bal <= 0 || card.bal < fare.fareKm) {
            return res.status(400).send({ message: 'Insufficient balance' });
        }

        await CardModel.findOneAndUpdate({ uid }, { tapState })

        return res.status(200).json(card);
    } catch (error) {
        console.log(error);
        return res.sendStatus(400);
    }
};

export const tapOut = async (req: express.Request, res: express.Response) => {
    try {
        const { uid } = req.params;
        const { tapState, bal } = req.body;

        const card = await getCardByUid(Number(uid));

        if (!card) {
            return res.status(404).send({ message: `Card does not exist` });
        }

        if (card.tapState.trim() == '') {
            return res.status(400).send({ message: 'No Entry!' })
        }

        await CardModel.findOneAndUpdate({ uid }, { tapState, bal })

        return res.status(200).json(card);
    } catch (error) {
        console.log(error);
        return res.sendStatus(400);
    }
};