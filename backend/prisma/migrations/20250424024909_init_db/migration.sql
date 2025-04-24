-- CreateEnum
CREATE TYPE "MailType" AS ENUM ('horoscope', 'quotes', 'jokes');

-- CreateEnum
CREATE TYPE "Zodiac" AS ENUM ('Aries', 'Taurus', 'Gemini', 'Cancer', 'Leo', 'Virgo', 'Libra', 'Scorpio', 'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces');

-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "mailType" "MailType" NOT NULL,
    "zodiacSign" "Zodiac",

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");
