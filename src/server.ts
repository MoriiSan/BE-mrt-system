//Importing Libraries 
import express from 'express'
import * as dotenv from 'dotenv';
import { stations } from './stations';
import { Station } from './db';
import { StationSchema } from './schema/StationSchema';
import * as mongoose from 'mongoose';
dotenv.config();

const PORT = process.env.PORT || 8000


const startServer = async (app: express.Express) => {


  //Listing to the app and running it on PORT 5000
  app.listen(PORT, async () => {
      console.log(`listning on port ${PORT}`)
  })

  app.get('/stations/list-stations', async (req, res)=> {

    const stations = await Station.find();
    Station.create({
      stationName: 'cubao',
      coordinates: [10,10],
      stationDisplay: 'Cubao'
    })
    console.log("stations", stations)
    res.status(200).send(stations)
  })
  app.get('/stations/create-cubao', async (req, res)=> {

    const cubaoStation = await Station.create({
      stationName: 'cubao',
      coordinates: [10,10],
      stationDisplay: 'CUbao'
    })
    res.status(200).send(cubaoStation)
  })


  app.get('/stations/get/:id', (req, res)=> {
    const id = req.params['id'];
    const station = stations.find((s)=>s.id===Number(id));
    if (station) {
      res.status(200).send(
        station
      )
    } else {
      res.status(500).send({
        message: "Station not found"
      });
    }
  })



  app.post('/stations/add', (req, res)=> {
    const stationName = 'kamuning';
    const coodinates = '[1.0, 1.0]';


    res.send({
      message: "Station Has been added successfuly",
    }).status(200);
  })

}

export default startServer;