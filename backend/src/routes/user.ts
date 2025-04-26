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

        const otp = Math.floor(100000 + Math.random() * 900000).toString();

        const tempUserData = {
            name: userData.name,
            email: userData.email,
            mailType: userData.mailType,
            zodiacSign:  userData.zodiacSign
        }

        await redis.set(`otp:${userData.email}`, JSON.stringify({
            otp: otp,
            user: tempUserData
        }),'EX',300)

        await sendMailToUser(userData.email,'Verify your Email',`Your otp is ${otp}`)
        
        return res.status(200).json({ message: 'OTP sent to your email.' });
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


userRouter.get('/verify/:email',async(req:Request,res:Response):Promise<any>=>{
    try{
        const email = req.params.email;

        const isUser = await prisma.user.findUnique({
            where:{
                email
            }
        })

        if(!isUser){
            return res.status(401).json({
                message: `${email} Email is not verfied`
            })
        }

        return res.json({
            message: "User is verfied!!!",
            user: isUser
        })
    }catch(error){
        return res.status(500).json({ message: 'Internal server error!!!' });
    }
})


userRouter.post('/verifyOtp',async(req:Request,res:Response):Promise<any>=>{
    try{
        const {email,otp} = req.body;

        const data = await redis.get(`otp:${email}`);

        console.log(data)

        if(!data){
            return res.status(400).json({ message: 'OTP expired or not found.' });
        }

        const parsedData = JSON.parse(data)

        console.log(parsedData)

        if(parsedData.otp !== otp){
            return res.status(400).json({ message: 'Invalid OTP.' });
        }

        await prisma.user.create({
            data: parsedData.user
        })

        await redis.del(`otp:${email}`); 

        return res.status(200).json({ message: 'Email verified successfully!' });
    }catch(error){
        return res.status(500).json({ message: 'Failed to verify OTP.' });
    }
})


userRouter.get('/randomQuotes',async(req:Request,res:Response):Promise<any>=>{
    try{
        const users: any[] = await prisma.user.findMany({
            where:{
                mailType: "quotes"
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
                }
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


userRouter.post('/unsubscribe/request',async(req:Request,res:Response):Promise<any>=>{
    try{
        const {email} = req.body;

        const isUser = await prisma.user.findUnique({
            where:{
                email
            }
        })

        if(!isUser){
            return res.status(404).json({
                message: "email does not exists!!!"
            })
        }

        const otp = Math.floor(100000 + Math.random() * 900000).toString();

        await redis.set(`otp:${email}`,otp,'EX',300)

        await sendMailToUser(email,'Verify your Email',`Your otp is ${otp}`)

        return res.json({
            message: "Otp has been sent to email."
        })
    }catch(error){
        return res.status(500).json({
            message: "Internal server error!!!!"
        })
    }
})


userRouter.post('/unsubscribe/verify',async(req:Request,res:Response):Promise<any>=>{
    try{
        const {otp,email} = req.body;

        const storedOtp = await redis.get(`otp:${email}`);

        if(!storedOtp){
            return res.status(400).json({ message: "Otp expired!!!" })
        }

        if(otp !== storedOtp){
            return res.status(400).json({ message: 'Invalid OTP.' });
        }

        await prisma.user.delete({
            where:{
                email
            }
        })

        await redis.del(`otp:${email}`);

        await sendMailToUser(email,'Email unsubscribed',"Thank you for using our services!!")

        return res.status(200).json({ message: "Email unsubscribed successfully!!!" })
    }catch(error){
        return res.status(500).json({
            message: "Internal server error!!!!"
        })
    }
})