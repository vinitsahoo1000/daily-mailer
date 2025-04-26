import { useState } from "react"
import { Button } from "../components/Button"
import { Heading } from "../components/Heading"
import { InputBox } from "../components/InputBox"
import { useNavigate, useParams } from "react-router-dom"
import axios from "axios"
import { toast } from "react-toastify"


export const SubscriptionPage = ()=>{
    const [otp,setOtp] = useState("");
    const {email} = useParams();
    const {action} = useParams();
    const navigate = useNavigate();

    const unSubscribe = async()=>{
        try{
            const response = await axios.post(`http://localhost:3000/api/v1/user/subscription/verify`,{
                email,
                otp,
                action
            })
            toast.info(response.data.message)
            navigate('/')
        }catch(error:any){
            toast.error(error.response.data.message)
        }
    }

    return(
        <div>
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
                <Button label="Verify OTP" onClick={unSubscribe} />
            </div>
        </div>
    )
}