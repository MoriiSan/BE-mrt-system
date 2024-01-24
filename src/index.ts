import express from 'express';
import http from 'http';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import compression from 'compression';
import cors from 'cors';
import mongoose from 'mongoose';

import router from './router';

const app = express();

app.use(cors({
    credentials: true,
}));

app.use(compression());
app.use(cookieParser());
app.use(bodyParser.json());

const server = http.createServer(app);

server.listen(8080, () => {
    console.log('Server running on http://localhost:8080/');
});

const MONGO_URL = `mongodb+srv://jhenna-mrt:TThJH5UEnT8IL9hA@mrt-system.cquj5ag.mongodb.net/mrt`

mongoose.Promise = Promise;
mongoose.connect(MONGO_URL, {
    dbName: 'mrt', // Specify the database name here
}).then(() => {
    console.log('Connected to MRT-SYSTEM');
}).catch((err) => {
    console.error('Error connecting to MRT-SYSTEM:', err);
});
mongoose.connection.on('error', (error: Error)=> console.log(error)); 

app.use('/', router())