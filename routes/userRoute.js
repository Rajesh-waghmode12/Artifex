import express from 'express';
import { register , login , userCredits } from '../controllers/userController.js';
import userAuth from '../middleware/auth.js';
const userRouter = express.Router();


userRouter.post('/register', register);
userRouter.post('/login', login);
userRouter.get('/credit',userAuth, userCredits);


export default userRouter;