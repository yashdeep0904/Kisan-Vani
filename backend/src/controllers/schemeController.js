import { generateSchemeAnswer } from '../services/aiService.js';

export const querySchemes = async (req, res) => {
  try {
    const { query } = req.body;
    if (!query) return res.status(400).json({ error: 'Query is required' });

    const result = await generateSchemeAnswer(query);
    res.json({ result });
  } catch (error) {
    console.error('Scheme Query Error:', error);
    res.status(500).json({ error: 'Failed to query scheme database' });
  }
};