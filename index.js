import express from 'express';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';
import User from './routes/userRoute.js';
import Admin from './routes/adminRoute.js';
import SubAdmin from './routes/subAdminRoute.js';
import cors from 'cors';
import dotenv from "dotenv";
dotenv.config();

const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const db = process.env.MONGO_URL;
mongoose.connect(db)
  .then(() => console.log('Database Connected'))
  .catch((e) => console.log('error'))

app.use('/api', Admin);
app.use('/api', SubAdmin);
app.use('/api', User);

app.get('/', (req, res) => {
    res.send('Server');
})

const port = process.env.PORT || 3001;

app.listen(port, () => {
    console.log(`Running on Port ${port}`);
})