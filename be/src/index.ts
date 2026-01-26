import dotenv from "dotenv";
import express, { type NextFunction, type Request, type Response } from "express";
import cors from "cors";
import authRouter from "./routes/auth.js";

dotenv.config();
const app=express();
const PORT=4000;

app.use(express.json());
app.use(cors());
//routes
app.use('/auth', authRouter);

app.get("/health",(req,res)=>{
    res.send("Status Ok");
});


//error handler
app.use((err:Error,req:Request,res:Response,next:NextFunction)=>{
    console.log(err);
    return res.status(500).json({success:false,message:"Internal Server Error Occured"});
    
})
app.listen(PORT,()=>{
    console.log(`Server running at http://localhost:${PORT}`);
});