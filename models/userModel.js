import mongoose from 'mongoose';
import express from 'express';


const userSchema = mongoose.Schema({
    name: {
        type: String,
        required : true
    },
    email: {
        type: String,
        required: true,
        unique : true
    },
    password: {
        type: String,
        required: true
    },
    creditBalance: {
        type: Number,
        default : 5
    }
})

const User = mongoose.model("User", userSchema, "users");
export default User;
