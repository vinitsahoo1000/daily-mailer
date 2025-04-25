import { useNavigate } from "react-router-dom"
import { Heading } from "../components/Heading"


export const HomePage = ()=>{
    const navigate = useNavigate();

    return(
        <div className="bg-blue-700 min-h-screen py-10">
            <div className="text-center text-white mb-6">
                <Heading label="Daily-Mailer" />
            </div>

            <div className="max-w-4xl mx-auto mt-6 p-6 text-lg font-medium bg-white shadow-xl rounded-2xl border border-gray-200 space-y-4 leading-relaxed text-gray-800">
                <h1 className="text-2xl font-bold text-indigo-600">
                Welcome to DailyMailer — Your Daily Dose of Wisdom & Wonder!
                </h1>

                <p>
                Start each day with inspiration and insight delivered straight to your inbox. With DailyMailer, you'll receive:
                </p>

                <ul className="list-disc list-inside space-y-1">
                <li>🌟 <strong>Personalized Horoscopes</strong> — Stay aligned with the stars.</li>
                <li>🧠 <strong>Motivational Quotes</strong> — Fuel your day with positivity and power.</li>
                </ul>

                <p className="text-gray-600">
                No spam, no fluff — just daily value that adds meaning to your morning.
                </p>
            </div>

            <div className="flex justify-center mt-10 text-md font-mono bg-white max-w-xl mx-auto shadow-lg rounded-2xl p-5 border border-gray-300">
                <ul className="list-disc list-inside space-y-2 text-gray-700">
                <li>✨ Daily zodiac horoscope tailored to your sign</li>
                <li>💬 Hand-picked motivational and inspirational quotes</li>
                <li>📅 Delivered every morning, so you start the day right</li>
                <li>🔒 Your email is safe with us — no third-party sharing</li>
                </ul>
            </div>

            <div className="flex justify-center mt-10">
            <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-300 max-w-xl w-full text-center space-y-4">
                <h3 className="text-xl font-semibold text-gray-800">
                Ready to get inspired every morning?
                </h3>
                <button onClick={()=> navigate('/register')} className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-3 rounded-lg transition">
                Subscribe Now
                </button>
                <p className="text-sm text-gray-500">
                We’ll never share your email. Unsubscribe anytime.
                </p>
            </div>
            </div>

            <div className="max-w-xl mx-auto p-6 mt-10 bg-white shadow-lg rounded-2xl border border-gray-200 space-y-4">
                <h2 className="text-2xl font-bold text-indigo-600">
                ✨ Your Daily Horoscope & Quote is Here!
                </h2>

                <p className="text-gray-700 text-lg">
                Hi <span className="font-semibold">[User Name]</span>,
                </p>
                <p className="text-gray-600">
                Here’s your daily dose of magic and motivation ✨
                </p>

                <div className="bg-indigo-50 p-4 rounded-lg">
                <h3 className="text-lg font-semibold text-indigo-700">
                    🌠 Your Horoscope for [Zodiac Sign]:
                </h3>
                <p className="text-gray-800 mt-1 italic">
                    "Today, trust your instincts. Opportunities may arise when you least expect them. Stay open-minded, and let your creativity lead the way."
                </p>
                </div>

                <div className="bg-yellow-50 p-4 rounded-lg">
                <h3 className="text-lg font-semibold text-yellow-700">
                    🧠 Quote of the Day:
                </h3>
                <p className="text-gray-800 mt-1 italic">
                    "Success is not final, failure is not fatal: it is the courage to continue that counts."
                </p>
                <p className="text-sm text-right text-gray-500 mt-1">— Winston Churchill</p>
                </div>

                <p className="text-gray-600">See you tomorrow for more!</p>
                <p className="text-indigo-500 font-medium">— The DailyMailer Team</p>
            </div>
            </div>
    )
}