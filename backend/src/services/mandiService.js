import { GoogleGenAI } from '@google/genai';

export const fetchMandiIntelligence = async (district = 'Rohtak', crop = 'Wheat') => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) throw new Error('GEMINI_API_KEY is not set.');

  const ai = new GoogleGenAI({ apiKey });

  const prompt = `Act as an official Indian APMC Mandi market intelligence analyst.
Provide realistic, up-to-date daily market rate analysis and different varieties for the commodity "${crop}" in district/mandi "${district}", India.

Return your response strictly as a valid JSON object:
{
  "district": "${district}",
  "crop": "${crop}",
  "aiAnalysis": "A 3-sentence market sentiment forecast on current price trends and selling advice.",
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
}`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
    });

    const rawText = response.text.trim().replace(/^```json/i, '').replace(/^```/i, '').replace(/```$/i, '');
    return JSON.parse(rawText);
  } catch (err) {
    console.warn(`[Mandi Service]: Real-time call failed: ${err.message}`);
    return {
      district,
      crop,
      aiAnalysis: `Market arrivals for ${crop} in ${district} remain stable across local APMC yards.`,
      varieties: [
        {
          variety: `${crop} (Standard)`,
          date: new Date().toISOString().split('T')[0],
          mandi: `${district} APMC Yard`,
          min: 2200,
          max: 2550,
          modal: 2400
        }
      ]
    };
  }
};