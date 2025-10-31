import express from 'express';
import jwt from 'jsonwebtoken'

const userAuth = async (req, res, next) => {
    const { token } = req.headers;
    if (!token) {
        return res.status(401).json({
            message: "Access sdfaf denied",
            success:false
        })
    }
    try {
        const tokenDeconded = jwt.verify(token, process.env.JWT_SECRET);
        if (!tokenDeconded.email) {
            return res.status(401).json({
                message: "Access denied",
                success: false
            })
        }
        req.user = { email: tokenDeconded.email };
        next();

    } catch (error) {
        res.status(500).json({
            message: error.message,
            success:false
        })
    }
}

export default userAuth;