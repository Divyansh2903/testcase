import dotenv from "dotenv";
import express, { type NextFunction, type Request, type Response } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import authRouter from "./routes/auth.js";
import problemRouter from "./routes/problem.js";
import { authMiddleware } from "./middlewares/authMiddleware.js";
import submissionRouter from "./routes/submission.js";
import { FRONTEND_ORIGIN } from "./configs/constants.js";

dotenv.config();
const app = express();
const PORT = 4000;

app.use(express.json());
app.use(cookieParser());
app.use(cors({
  origin: FRONTEND_ORIGIN,
  credentials: true,
}));
//routes
app.use('/auth', authRouter);
app.use('/problemset',authMiddleware, problemRouter);
app.use('/submission',authMiddleware, submissionRouter);

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