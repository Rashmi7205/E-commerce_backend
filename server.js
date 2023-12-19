import express from 'express';
import testRouter from './routes/test.route.js';
import cookieParser from 'cookie-parser';
import cors from 'cors'

const app = express();

app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));


app.use(cors({
    origin:"*",
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  }));
  

app.use('/api/home',testRouter);


app.all('*', (req, res) => {
    return res.status(404).send('OOPS!! PAGE NOT FOUND');
  });

export default app;