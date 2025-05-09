import express from "express"
import cors from "cors";
import { userRouter } from "./routes/user";


const app = express();
const port = 3000;;

app.use(express.json())
app.use(cors())

app.use('/api/v1/user',userRouter)


app.listen(port,()=>{
    console.log(`Server is running on port ${port}`)
})