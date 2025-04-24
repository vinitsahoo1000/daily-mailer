import { MailType, Zodiac } from "@prisma/client";
import z from "zod";



export const UserDataSchema = z.object({
    name: z.string().min(2),
    email: z.string().email(),
    mailType: z.nativeEnum(MailType),
    zodiac: z.nativeEnum(Zodiac).optional()
})