import {Router,Request,Response} from "express";
import { UserDataSchema } from "../schema";
import { ZodError } from "zod";
import { PrismaClient } from "@prisma/client";
import nodemailer from "nodemailer";
import axios from "axios";
import redis from "../redis/redis";


const prisma = new PrismaClient();
export const userRouter = Router();

const transporter = nodemailer.createTransport({
    service: 'gmail',
    port: 587,
    secure: false, 
    auth: {
        user: process.env.EMAIL,
        pass: process.env.EMAIL_PASSWORD,
    },
});

const sendMailToUser = async (email: string, subject: string, text: string): Promise<void> => {
    await transporter.sendMail({
        from: process.env.EMAIL,
        to: email,
        subject,
        text
    });
};



userRouter.post('/signup',async(req:Request,res:Response):Promise<any>=>{
    try{
        const userData = UserDataSchema.parse(req.body);

        const existingUser = await prisma.user.findUnique({
            where:{
                email: userData.email
            }
        })

        if(existingUser){
            return res.status(409).send({
                message: "User already exists!!"
            })
        }

        const newUser = await prisma.user.create({
            data:{
                name: userData.name,
                email: userData.email,
                mailType: userData.mailType,
                zodiacSign: userData.zodiac
            }
        })

        return res.status(201).json({
            message: "New user signup successful!!",
            user: newUser
        })

    }catch(error){
        if(error instanceof ZodError){
            return res.status(400).json({
                message: "Invalid Input!!"
            })
        }
        return res.status(500).json({
            error: "Internal Server Error!!!"
        })
    }
})


userRouter.post('/verifyEmail',async(req:Request,res:Response):Promise<any>=>{
    try{
        const {email} = req.body;

        const user = await prisma.user.findUnique({
            where:{
                email
            }
        })

        if(!user){
            return res.status(404).json({ message: 'User not found.' });
        }

        if(user.verified){
            return res.status(400).json({ message: 'Email is already verified.' });
        }

        const otp = Math.floor(100000 + Math.random() * 900000).toString();

        await redis.set(`otp: ${email}`,otp,'EX',300)

        await sendMailToUser(email,'Verify your Email',`Your otp is ${otp}`)
        
        return res.status(200).json({ message: 'OTP sent to your email.' });
    }catch(error){
        return res.status(500).json({ message: 'Failed to send OTP.' });
    }
})


userRouter.post('/verifyOtp',async(req:Request,res:Response):Promise<any>=>{
    try{
        const {email,otp} = req.body;

        const user = await prisma.user.findUnique({
            where:{
                email
            }
        })

        if(!user){
            return res.status(404).json({ message: 'User not found.' });
        }

        if(user.verified){
            return res.status(400).json({ message: 'Email is already verified.' });
        }

        const storedOtp = await redis.get(`otp: ${email}`);

        if(!storedOtp){
            return res.status(400).json({ message: 'OTP expired or not found.' });
        }

        if(storedOtp !== otp){
            return res.status(400).json({ message: 'Invalid OTP.' });
        }

        await prisma.user.update({
            where:{
                email: email
            },
            data:{
                verified: true
            }
        })

        await redis.del(`otp:${email}`); 

        return res.status(200).json({ message: 'Email verified successfully!' });
    }catch(error){
        return res.status(500).json({ message: 'Failed to send OTP.' });
    }
})


userRouter.get('/randomQuotes',async(req:Request,res:Response):Promise<any>=>{
    try{
        const users: any[] = await prisma.user.findMany({
            where:{
                mailType: "quotes",
                verified: true
            }
        })

        const response = await axios.get("https://api.api-ninjas.com/v1/quotes",{
                headers:{
                    "X-Api-Key": process.env.API_NINJAS_KEY!
                }
            })

        const quote = response.data[0].quote

        for (const user of users){
            await sendMailToUser(user.email, "Your daily random quote", quote);
        }

        return res.status(200).send({
            msg: "mail sent successfully!!"
        })
    }catch(error){
        return res.status(500).json({
            message: "Internal server error!!!"
        })
    }
})

userRouter.get('/horoscope',async(req:Request,res:Response):Promise<any>=>{
    try{
        const users: any[] = await prisma.user.findMany({
            where:{
                zodiacSign:{
                    not: null
                },
                verified: true
            }
        })

        let horoscopeData: Record<string, string> = {};

        for (const user of users){
            const sign = user.zodiacSign

            if(horoscopeData[sign]){
                await sendMailToUser(user.email, "Your daily horoscope", horoscopeData[sign]);
            }else{
                const response = await axios.get(`https://api.api-ninjas.com/v1/horoscope?zodiac=${sign}`,{
                    headers:{
                        "X-Api-Key": process.env.API_NINJAS_KEY!
                    }
                })

                const horoscopeText = response.data.horoscope;
                horoscopeData[sign] = horoscopeText;

                await sendMailToUser(user.email, "Your daily horoscope", horoscopeText);
            }
        }
        
        return res.status(200).send({
            msg: "mail sent successfully!!"
        })
    }catch(error){
        return res.status(500).json({
            message: "Internal server error!!!!"
        })
    }
})


