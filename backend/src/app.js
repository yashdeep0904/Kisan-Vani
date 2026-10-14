import dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import helmet from 'helmet';
import apiRoutes from './routes/apiRoutes.js';


const app = express();

app.use(helmet());
app.use(cookieParser());
app.use(express.json({ limit: '10mb' }));
app.use(cors({
  origin: [
    'http://localhost:5173', // Local Vite development
    'https://kisan-vani-client.onrender.com' // Replace with your Vercel URL later
  ],
  credentials: true
}));

app.get("/", (req, res) => {
    res.status(200).json({
        status: "success",
        message: "Backend server is live and operational!"
    })
})

app.use('/api', apiRoutes);

export default app;