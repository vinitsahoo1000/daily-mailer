import { useState } from "react"

const zodiacSigns = [
    "Aries", "Taurus", "Gemini", "Cancer", "Leo", "Virgo",
    "Libra", "Scorpio", "Sagittarius", "Capricorn", "Aquarius", "Pisces"
]

export const ZodiacDropBox = ({ setZodiacSign }: { setZodiacSign: (sign: string) => void })=>{
    const [selectedSign,setSelectedSign] = useState<string>("");

    const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const selectedValue = event.target.value;
        setSelectedSign(selectedValue);
        setZodiacSign(selectedValue);
    }

    return(
        <div className="mt-4">
        <label htmlFor="zodiac-sign" className="block text-lg text-gray-700">
            Select Your Zodiac Sign:
        </label>
        <select
            id="zodiac-sign"
            value={selectedSign}
            onChange={handleChange}
            className="mt-2 p-2 border border-gray-300 rounded-lg"
        >
            <option value="">Select a Zodiac Sign</option>
            {zodiacSigns.map((sign) => (
            <option key={sign} value={sign}>
                {sign}
            </option>
            ))}
        </select>
        </div>
    )
}