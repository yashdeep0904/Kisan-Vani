import { GoogleGenAI } from '@google/genai';
import { fetchWeatherData } from '../services/weatherService.js';
import { fetchSchemes, getAISchemeAdvice } from '../services/schemeService.js';

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// ==========================================
// 1. Mandi Rates & Multi-Variety Intelligence
// ==========================================
export const getMandiPrices = async (req, res) => {
  try {
    const { district = 'Rohtak', crop = 'Wheat' } = req.query;
    const apiKey = process.env.GEMINI_API_KEY;
    
    if (!apiKey) {
      return res.status(500).json({ error: 'Server configuration error: Missing AI API Key.' });
    }

    const ai = new GoogleGenAI({ apiKey });
    const prompt = `Act as an official Indian APMC Mandi market intelligence analyst.
Provide realistic, up-to-date daily market rate analysis and different varieties for the commodity "${crop}" in district/mandi "${district}", India.
Return your response strictly as a valid JSON object matching this exact structure:
{
  "district": "${district}",
  "crop": "${crop}",
  "aiAnalysis": "A comprehensive 3-sentence market sentiment forecast explaining current price trends, demand, and best selling advice for farmers.",
  "varieties": [
    {
      "variety": "Name of variety",
      "date": "${new Date().toISOString().split('T')[0]}",
      "mandi": "${district} Main APMC Yard",
      "min": 2250,
      "max": 2600,
      "modal": 2450
    }
  ]
}
Provide at least 3 distinct varieties. Return ONLY raw JSON.`;

    const modelsToTry = ['gemini-3.8-flash', 'gemini-2.0-flash'];
    const maxRetries = 3;
    let response;

    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      for (const modelName of modelsToTry) {
        try {
          response = await ai.models.generateContent({ model: modelName, contents: prompt });
          if (response?.text) break;
        } catch (err) {
          console.warn(`[Mandi Rates]: ${modelName} attempt ${attempt} failed: ${err.message}`);
        }
      }
      if (response?.text) break;
      if (attempt < maxRetries) await delay(attempt * 1500); 
    }

    let mandiData;
    if (response?.text) {
      const rawText = response.text.trim().replace(/^```json/i, '').replace(/^```/i, '').replace(/```$/i, '');
      mandiData = JSON.parse(rawText);
    } else {
      mandiData = {
        district: district,
        crop: crop,
        aiAnalysis: `Market arrivals for ${crop} in ${district} remain steady. Farmers are advised to release stock in phased batches to capture optimal modal realizations.`,
        varieties: [
          { variety: `${crop} (Standard)`, date: new Date().toISOString().split('T')[0], mandi: `${district} APMC`, min: 2150, max: 2420, modal: 2310 }
        ]
      };
    }

    res.json(mandiData);
  } catch (error) {
    console.error('Mandi Prices Error:', error.message);
    res.status(500).json({ error: 'Failed to fetch live Mandi market rates.' });
  }
};

// ==========================================
// 2. Weather Controller 
// ==========================================
export const getWeather = async (req, res) => {
  try {
    const { lat = '28.6139', lon = '77.2090' } = req.query;
    const data = await fetchWeatherData(lat, lon);
    return res.json({ data });
  } catch (error) {
    console.error(`[Weather API Error]: ${error.message}`);
    return res.status(500).json({ error: error.message });
  }
};

// ==========================================
// 3. Schemes Controllers
// ==========================================
export const getSchemes = async (req, res) => {
  try {
    const { search = '', category = 'All' } = req.query;
    const schemes = await fetchSchemes(search, category);
    res.json({ data: schemes });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch government schemes' });
  }
};

export const getSchemeAdvice = async (req, res) => {
  try {
    const { state, landSize, crop, farmerType } = req.body;
    const advice = await getAISchemeAdvice({ state, landSize, crop, farmerType });
    res.json({ advice });
  } catch (error) {
    res.status(500).json({ error: 'Failed to generate scheme eligibility advice' });
  }
};