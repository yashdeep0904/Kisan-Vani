import dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import helmet from 'helmet';
import apiRoutes from './routes/apiRoutes.js';

const app = express();

// Security and Parsing Middlewares
app.use(helmet());
app.use(cookieParser());
app.use(express.json({ limit: '10mb' }));

// CORS Policy Configuration
const allowedOrigins = [
  'http://localhost:5173',
  'https://kisan-vani-client.onrender.com'
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('CORS policy violation'));
    }
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));

// Root Health Check Route
app.get('/', (req, res) => {
  res.status(200).json({
    status: 'success',
    message: 'Backend server is live and operational!'
  });
});

// Mount API Routes
app.use('/api', apiRoutes);

export default app;