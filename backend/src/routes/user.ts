import {Router,Request,Response} from "express";
import { UserDataSchema } from "../schema";
import { ZodError } from "zod";
import { PrismaClient } from "@prisma/client";
import nodemailer from "nodemailer";
import axios from "axios";
import redis from "../redis/redis";
import cron from "node-cron";

const prisma = new PrismaClient();
export const userRouter = Router();


cron.schedule('0 9 * * *', async()=>{
    console.log('Running daily API call....')
    try{
        const [quotesResponse, horoscopeResponse] = await Promise.all([
            axios.get(`${process.env.BACKEND_URL}/api/v1/user/randomQuotes`),
            axios.get(`${process.env.BACKEND_URL}/api/v1/user/horoscope`)
        ]);
        console.log('✅ Quotes API Response:', quotesResponse.data);
        console.log('✅ Horoscope API Response:', horoscopeResponse.data);
    }catch(error){
        console.error('❌ Error during scheduled API call:', (error as Error).message);
    }
});


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
                mailType: "quotes",
                isActive: true
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
                mailType: "horoscope",
                isActive: true
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


userRouter.post('/resubscribe/request',async(req:Request,res:Response):Promise<any>=>{
    try{
        const {email} = req.body;

        const isUser = await prisma.user.findUnique({
            where:{
                email,
                isActive: false
            }
        })

        if(!isUser){
            return res.status(404).json({
                message: "email does not exists or already subscribed"
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


userRouter.post('/unsubscribe/request',async(req:Request,res:Response):Promise<any>=>{
    try{
        const {email} = req.body;

        const isUser = await prisma.user.findFirst({
            where:{
                email,
                isActive: true
            }
        })

        if(!isUser){
            return res.status(404).json({
                message: "Email does not exist or is already unsubscribed."
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


userRouter.post('/subscription/verify',async(req:Request,res:Response):Promise<any>=>{
    try{
        const {otp,email,action} = req.body;

        if (!email || !otp || !action) {
            return res.status(400).json({ message: "Email, OTP, and action are required." });
        }

        const storedOtp = await redis.get(`otp:${email}`);

        if(!storedOtp){
            return res.status(400).json({ message: "Otp expired!!!" })
        }

        if(otp !== storedOtp){
            return res.status(400).json({ message: 'Invalid OTP.' });
        }

        let isActive: boolean;
        let mailSubject: string;
        let mailBody: string;        

        if(action === "unsubscribe"){
            isActive = false;
            mailSubject = "Email unsubscribed";
            mailBody = "Thank you for using our services!!"
        }else if(action === "subscribe"){
            isActive = true;
            mailSubject = "Email resubscribed";
            mailBody = "Welcome back! You have successfully resubscribed to our services."
        }else {
            return res.status(400).json({ message: "Invalid action." });
        }

        await prisma.user.update({
            where:{
                email
            },
            data:{
                isActive
            }
        })

        await redis.del(`otp:${email}`);

        await sendMailToUser(email,mailSubject,mailBody)

        return res.status(200).json({ message: `Email ${action}d successfully!!!` })
    }catch(error){
        return res.status(500).json({
            message: "Internal server error!!!!"
        })
    }
})