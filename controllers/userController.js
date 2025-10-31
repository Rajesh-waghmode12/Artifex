import express from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import User from '../models/userModel.js'

const register = async (req, res) => {
    try {
        
        const { name, email, password } = req.body;
        //check karo data pura hai kya ? 
        if (!name || !email || !password) {
            return res.status(400).json({
                message: "Missing details ...",
                success: false
            })
        }
        

        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({
                message: "User already exists. Please log in.",
                success: false,
            });
        }
        
        //password ko hash kardo
        const hashedPassword = await bcrypt.hash(password, 10);
        //database me insert krdo hashed password ke sath
        const user = new User({ name, email, password: hashedPassword });
        await user.save();
        //token generate karo   
        const token = jwt.sign({email: user.email}, process.env.JWT_SECRET, { expiresIn: '24h' });
        // token responce ke sath send kardo
        res.status(200).json({
            message: "data saved successfully",
            success: true,
            user : user.name,
            token
        })

    } catch (error) {
        res.status(500).json({
            message: error.message,
            success: false
        })
    }
}

const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        //check karo data pura hai kya ? 
        if (!email || !password) {
            return res.status(400).json({
                message: "Missing details ...",
                success: false
            })
        }
        //check karo valid user hai kay?
        const isValidUser = await User.findOne({ email });
        if (!isValidUser) {
            return res.status(401).json({
                message: "Unauthorized Access ",
                success: false
            })
        }
        //check karo valid passowd hai kay?
        const isValidPass = await bcrypt.compare(password, isValidUser.password);
        if (!isValidPass) {
            return res.status(401).json({
                message: "Unauthorized Access ",
                success: false
            })
        }
        //token generate karo 
        const token = jwt.sign({ email: isValidUser.email }, process.env.JWT_SECRET , {expiresIn : '24h'});
        // token responce ke sath send kardo
        res.status(200).json({
            message: "Logged In",
            success: true,
            user: isValidUser.name,
            creditBalance: isValidUser.creditBalance,
            token
        })
    } catch(error) {
        res.status(500).json({
            message: error.message,
            success: false
        })
    }
}


const userCredits = async (req, res) => {
    try {
        const { email } = req.user;
        const user = await User.findOne({email});
        if (!user) {
            return res.status(401).json({
                message: "Access Denied",
                success:false
            })
        }
        res.status(200).json({
            message: "here is you credits",
            success: true,
            credit: user.creditBalance,
            user:user.name
        })
    } catch (error) {
        res.status(500).json({
            message: error.message,
            success: false,
        })
    }

}

export { register, login , userCredits};
