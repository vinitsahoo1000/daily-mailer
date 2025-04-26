import { useParams } from "react-router-dom";



export const VerifiedPage = ()=>{
    const {email} = useParams();

    return(
        <div>
            <span>Your E-Mail '{email}' has been verified successfully!!!!</span>
            <span>You will start emails from tomorrow onwards every morning!!!</span>
        </div>
    )
}