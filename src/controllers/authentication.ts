import express from "express";
import jwt from "jsonwebtoken";

import { getUserByUsername, createUser, getUserBySessionToken } from '../db/users';
import { random, authentication } from '../helpers';

export const login = async (req: express.Request, res: express.Response) => {
    try {
        const {username, password} = req.body;

        if (!username || !password) { 
            return res.sendStatus(400);
        }

        const user = await getUserByUsername(username).select('+authentication.salt +authentication.password');

        if(!user) {
            return res.sendStatus(400);
        }

        const expectedHash = authentication(user.authentication.salt, password);

        if(user.authentication.password !==  expectedHash) {
            return res.sendStatus(403);
        }

        //generate JWT
        const sessionToken = jwt.sign({ userId: user._id }, 'secretKey', { expiresIn: '1h' });
        user.authentication.sessionToken = sessionToken;

        // const salt = random();
        // user.authentication.sessionToken = authentication(salt, user._id.toString());

        await user.save();

        // res.cookie('TICKETING-AUTH', sessionToken, { domain: 'localhost', path: '/'});

        return res.status(200).json({user, sessionToken}).end();
    }catch (error) {
        console.log(error);
        return res.sendStatus(400);
    }
}

export const register = async (req: express.Request, res: express.Response) => {
    try {
        const {email, password, username} = req.body;

        if(!email || !password || !username){
            return res.sendStatus(400);
        }

        const existingUser = await getUserByUsername(username);

        if(existingUser) {
            return res.sendStatus(400);
        }

        const salt = random();
        const user = await createUser({
            email,
            username,
            authentication: {
                salt,
                password: authentication(salt, password),
            },
        });

        //generate JWT
        const sessionToken = jwt.sign({ userId: user._id }, 'SECRET', { expiresIn: '1h' });

        return res.status(200).json({user, sessionToken}).end();
    }catch(error){
        console.log(error);
        return res.sendStatus(400);
    }
};
