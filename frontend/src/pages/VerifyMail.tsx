import { useParams } from "react-router-dom"
import { Heading } from "../components/Heading"
import { InputBox } from "../components/InputBox"
import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { Button } from "../components/Button";


export const VerifyMail = ()=>{
    const {email} = useParams();
    const [otp,setOtp] = useState("");
    const [verified,setVerified] = useState(false);

    useEffect(()=>{
        const verificationState = async()=>{
            try{
                const response = await axios.get(`http://localhost:3000/api/v1/user/verify/${email}`)
    
                if(response.status === 200){
                    setVerified(true)
                }
            }catch(error:any){
                toast.error(error.response.data.message)
            }
        }

        verificationState();
    },[email])


    const verifyOtp = async()=>{
        try{
            const response = await axios.post("http://localhost:3000/api/v1/user/verifyOtp",{
                otp,
                email
            })
            toast.success(response.data.message)
            setVerified(true)
        }catch(error:any){
            toast.error(error.response.data.message)
        }
    }


    return(
            <div className="mt-28">
            {!verified ? (
                <>
                <div>
                    <Heading label="Verify your mail" />
                </div>
                <div className="flex justify-center mt-4 text-lg font-semibold">
                    Otp has been sent to {email}
                </div>
                <div className="flex justify-center">
                    <InputBox onChange={(e) => setOtp(e.target.value)} label="OTP" />
                </div>
                <div className="flex justify-center">
                    <Button label="Verify OTP" onClick={verifyOtp} />
                </div>
                </>
            ) : (
                <div className="mt-28 flex flex-col items-center justify-center gap-4 px-4">
            <div className="text-center text-green-600 text-2xl font-bold">
                ✅ Your Email {email} is Verified!
            </div>
            <div className="text-center text-gray-700 text-lg">
                Thank you for verifying your email address. 🎉
            </div>
            <div className="text-center text-gray-600">
                You are now officially subscribed to receive our daily services, including inspirational quotes and personalized horoscopes.
            </div>
            <div className="text-center text-gray-600">
                Stay tuned for exciting updates straight to your inbox!
            </div>
            <div className="mt-6">
                <a
                    href="/"
                    className="text-blue-600 hover:underline font-semibold"
                >
                    Go back to Homepage
                </a>
            </div>
            </div>
            )}
            </div>
        );
} 