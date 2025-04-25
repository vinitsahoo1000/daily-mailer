import { useState } from "react"
import axios from "axios";
import { Heading } from "../components/Heading"
import { InputBox } from "../components/InputBox"
import { Button } from "../components/Button";
import { toast } from "react-toastify";
import {DropdownButton} from "../components/DropDownMenu";
import { ZodiacDropBox } from "../components/ZodiacDropDown";


export const RegisterPage = ()=>{
    const [name,setName] = useState("");
    const [email,setEmail] = useState("");
    const [mailType, setMailType] = useState<"horoscope" | "quotes">();
    const [zodiacSign,setZodiacSign] = useState("");

    const registerUser = async()=>{
        try{
            const response = await axios.post('http://localhost:3000/api/v1/user/signup',{
                name,
                email,
                mailType,
                zodiac: zodiacSign
            })
            toast.success(response.data.message)
        }
        catch(error:any){
            toast.error(error)
        }
    }


    return(
        <div>
            <div className="flex flex-col items-center min-h-screen">
            <div className="p-5 w-full max-w-md mx-auto">
                <div className="mt-5 text-center">
                    <Heading label="Sign Up"/>
                </div>
                <div className="mt-3 text-center text-black">
                    Register your email for daily emails!
                </div>
                <div className="mt-2 flex flex-col items-center">
                    <div>
                        <InputBox label="Full Name" onChange={(e) => {setName(e.target.value)}} placeholder="Full Name"/>
                        <InputBox label="Email" onChange={(e) => {setEmail(e.target.value)}} placeholder="Username"/>
                        <div className="ml-15">
                        <DropdownButton selected={mailType ?? "horoscope"} setSelected={setMailType} />
                        <ZodiacDropBox setZodiacSign={setZodiacSign}/>
                        </div>
                    </div>
                    <div className="mt-6">
                        <Button label="Sign Up" onClick={registerUser}/>
                    </div>
                </div>
            </div>
        </div>
        </div>
    )
}