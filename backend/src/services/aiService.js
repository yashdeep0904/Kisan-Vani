import { ai } from '../config/gemini.js';

export const generateCropDiagnosis = async (imageBuffer, mimeType) => {
  const imagePart = {
    inlineData: {
      data: imageBuffer.toString('base64'),
      mimeType: mimeType,
    },
  };

  const prompt = `Analyze this crop leaf. Output ONLY valid JSON matching this exact structure:
  {
    "diseaseName": "Name of the disease or Pest",
    "confidence": "Percentage",
    "symptoms": ["symptom 1", "symptom 2"],
    "pesticides": [
      { "name": "Chemical name", "dosage": "Amount per liter", "frequency": "Application timeline" }
    ],
    "prevention": ["tip 1", "tip 2"]
  }`;

  const response = await ai.models.generateContent({
    model: 'gemini-2.0-flash',
    contents: [prompt, imagePart],
    config: { responseMimeType: 'application/json' }
  });

  return JSON.parse(response.text);
};

export const generateSchemeAnswer = async (query) => {
  const prompt = `You are an expert on Indian agricultural subsidies (PM-KISAN, PMFBY, etc.). 
  Answer the following farmer query simply and clearly in bullet points: "${query}"`;

  const response = await ai.models.generateContent({
    model: 'gemini-2.0-flash',
    contents: prompt,
  });

  return response.text;
};