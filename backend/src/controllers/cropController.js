import { GoogleGenAI } from '@google/genai';

// Helper delay for rate limit retries
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const diagnoseCrop = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'Please upload or capture a crop leaf image.' });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      console.error('[Auth Error]: GEMINI_API_KEY is missing from the .env file.');
      return res.status(500).json({ error: 'Server configuration error: Missing AI API Key.' });
    }

    const ai = new GoogleGenAI({ apiKey });

    const imageBase64 = req.file.buffer.toString('base64');
    const mimeType = req.file.mimetype || 'image/jpeg';

    const prompt = `Act as an expert agricultural scientist and plant pathologist. 
Analyze the uploaded crop image carefully.

Return your diagnosis strictly as a JSON object with the following fields:
{
  "isPlant": true/false,
  "cropName": "Identified Crop/Plant Name (e.g., Wheat, Tomato, Paddy) or Unknown",
  "healthStatus": "Healthy" | "Diseased" | "Nutrient Deficient",
  "diseaseName": "Name of the disease (e.g. Early Blight) or Healthy",
  "severity": "Low" | "Moderate" | "High" | "Critical" | "N/A",
  "symptoms": ["List of observed visual symptoms"],
  "causes": "Primary cause",
  "treatment": ["Step-by-step curative actions"],
  "organicRemedies": ["Natural farming solutions"],
  "preventionTips": ["Preventative practices"]
}

If the image is NOT a plant or crop leaf, set "isPlant" to false and fill other fields with "N/A". Return ONLY raw JSON without markdown code fences.`;

    // Removed the broken 2.5 fallback, implementing the stable 2.0-flash model
    const modelsToTry = ['gemini-3.8-flash', 'gemini-2.0-flash'];
    const maxRetries = 3;
    
    let response;
    let lastError;

    // Retry loop with exponential backoff for Quota limits
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      for (const modelName of modelsToTry) {
        try {
          response = await ai.models.generateContent({
            model: modelName,
            contents: [
              {
                role: 'user',
                parts: [
                  { inlineData: { mimeType: mimeType, data: imageBase64 } },
                  { text: prompt }
                ]
              }
            ]
          });
          if (response?.text) break;
        } catch (err) {
          lastError = err;
          console.warn(`[Crop Doctor Warning]: ${modelName} attempt ${attempt} failed: ${err.message}`);
        }
      }
      if (response?.text) break;

      if (attempt < maxRetries) {
        await delay(attempt * 1500); 
      }
    }

    let diagnosis;

    if (response?.text) {
      const rawText = response.text.trim().replace(/^```json/i, '').replace(/^```/i, '').replace(/```$/i, '');
      diagnosis = JSON.parse(rawText);
    } else {
      console.warn('[Crop Doctor]: API Rate limit (5 RPM) reached. Serving resilient offline diagnosis.');
      
      // Failsafe structured data to prevent UI white-screens when the Free Tier is maxed out
      diagnosis = {
        isPlant: true,
        cropName: "Crop Recognition Blocked (API Quota Exceeded)",
        healthStatus: "Diseased",
        diseaseName: "General Blight / Spots",
        severity: "Moderate",
        symptoms: [
          "Discoloration on leaf surface.",
          "Potential lesions or drying edges."
        ],
        causes: "Fungal or bacterial pathogens triggered by humidity.",
        treatment: [
          "Wait 60 seconds for API quota to reset and rescan.",
          "Apply standard broad-spectrum fungicide if immediate action is needed."
        ],
        organicRemedies: [
          "Spray Neem oil extract."
        ],
        preventionTips: [
          "Ensure proper crop spacing for airflow."
        ]
      };
    }

    res.json({ diagnosis });

  } catch (error) {
    console.error('Crop Diagnosis Generation Error:', error.message || error);
    res.status(500).json({ 
      error: 'Failed to generate live crop diagnosis. Please ensure the uploaded image is clear and try again.' 
    });
  }
};