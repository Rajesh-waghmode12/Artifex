import express from 'express';
import dotenv from 'dotenv';
import connectDB from './config/mongodb.js';
import userRouter from './routes/userRoute.js';
import cors from 'cors'
import User from './models/userModel.js';
import imageRouter from './routes/imageRoutes.js';

dotenv.config();
const app = express();


app.use(express.json());
app.use(cors());
await connectDB();


app.use('/api', userRouter);
app.use('/api', imageRouter);


const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
    console.log(`server is started on port ${PORT}`);
})