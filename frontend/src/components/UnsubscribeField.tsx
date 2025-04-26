import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom"
import { toast } from "react-toastify";


export const UnsubscribeField = ()=>{
    const navigate = useNavigate();

    const [email,setEmail] = useState("");

    const unsubscribeVerify = async()=>{
        try{
            const response = await axios.post(`http://localhost:3000/api/v1/user/unsubscribe/request`,{
                email
            })
            toast.info(response.data.message)
            navigate(`/unsubscribe/${email}`)
        }catch(error:any){
            toast.error(error.response.data.message)
        }
    }

    return(
        <div className="flex justify-center mt-10">
            <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-300 max-w-xl w-full text-center space-y-4">
                <h3 className="text-xl font-semibold text-gray-800">
                Want to unsubscribe Email services!!!
                </h3>
                <div>
                    <input onChange={(e)=> setEmail(e.target.value)} className="border border-gray-300 rounded-lg w-96 h-10 p-2.5" required/>
                </div>
                <button onClick={unsubscribeVerify} className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-3 rounded-lg transition">
                Unsubscribe Now
                </button>
            </div>
            </div>
    )
}