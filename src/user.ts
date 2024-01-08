//Importing Libraries 
import express from 'express'
import * as dotenv from 'dotenv';
import { stations } from './stations';
import { Station, User } from './db';
import { StationSchema } from './schema/StationSchema';
import * as mongoose from 'mongoose';
import jwt from 'jsonwebtoken';
dotenv.config();

const PORT = process.env.PORT || 8000
const JWT_SECRET = process.env.JWT_SECRET || '';


const userRoutes = async (app: express.Express) => {
  app.post('/user/login', async (req, res)=> {
    const userName = req.body.username;
    const password = req.body.password;
    
    const matched = await User.findOne({username:userName});

    if (matched?.password === password) {
      const token = jwt.sign(
        {
          username: matched?.username,
          firstname: matched?.firstName,
          lastname: matched?.lastName
        },
        JWT_SECRET,
        {
          expiresIn: '24h'
        },
      );

      res.status(200).send({
        jwt: token
      })
    } else {
      res.status(401).send({
        message: "access denied"
      })

    }
  })
}

export default userRoutes;