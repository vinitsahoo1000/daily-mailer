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
                <div className="text-center text-green-600 text-xl font-bold">
                ✅ Email Verified Successfully!
                </div>
            )}
            </div>
        );
} 