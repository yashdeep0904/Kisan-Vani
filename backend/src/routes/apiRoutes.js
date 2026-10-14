import express from 'express';
import { register, login, logout, getMe } from '../controllers/authController.js';
import { diagnoseCrop } from '../controllers/cropController.js';
import { 
  getMandiPrices, 
  getWeather, 
  getSchemes, 
  getSchemeAdvice 
} from '../controllers/dataController.js';
import { requireAuth } from '../middlewares/requireAuth.js';
import { upload } from '../middlewares/upload.js';

const router = express.Router();

// ==========================================
// 1. Authentication Routes
// ==========================================
router.post('/auth/register', register);
router.post('/auth/login', login);
router.post('/auth/logout', logout);

// Protected Auth Check (Verifies token & returns current user profile)
router.get('/auth/me', requireAuth, getMe);

// ==========================================
// 2. Public Data Feeds
// ==========================================
router.get('/mandi', getMandiPrices);
router.get('/weather', getWeather);
router.get('/schemes', getSchemes);
router.post('/schemes', getSchemes);
router.post('/schemes/advisor', getSchemeAdvice);

// ==========================================
// 3. AI Crop Doctor Diagnosis Route
// ==========================================
// Apply requireAuth if you want only logged-in users to run diagnosis
router.post('/diagnose', requireAuth, upload.single('image'), diagnoseCrop);

export default router;