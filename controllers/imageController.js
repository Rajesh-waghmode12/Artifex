import User from '../models/userModel.js';
import FromData from 'form-data';
import axios from 'axios';


export const generateImage = async (req, res) => {
    try {
        const { prompt } = req.body;
        const { email } = req.user;
        const user = await User.findOne({email})
        if (!email) {
            return res.status(401).json({
                message: "Acess Denied",
                success: false
            })
        }
        if (!user) {
            return res.status(401).json({
                message: "Acess Denied",
                success: false
            })
        }
        if (user && !prompt) {
            return res.staus(400).json({
                message: "Prompt missing",
                success: false
            })
        }
        if (user.creditBalance <= 0) {
            return res.status(403).json({
                message: "Insufficient credits, please recharge",
                success: false
            })
        }

        const formData = new FromData();
        formData.append('prompt', prompt);

        const {data} = await axios.post('https://clipdrop-api.co/text-to-image/v1', formData, {
            headers: {
                'x-api-key': process.env.CLIP_DROP_API_KEY,
            },
            responseType: 'arraybuffer'
        })
        
        const base64Imgage = Buffer.from(data, 'binary').toString('base64');
        const resultImage = `data:image/png;base64,${base64Imgage}`;

        user.creditBalance -= 1;
        await user.save();

        res.status(200).json({
            message: "Image generateds successfully",
            success: true,
            user: user.name,
            userCreditBalance: user.creditBalance,
            image: resultImage
        });    

    } catch (error) {
        res.status(500).json({
            message: error.message,
            success: falses
        })
    }
}