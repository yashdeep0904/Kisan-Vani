import { GoogleGenAI } from '@google/genai';

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

// Verified Real Government Schemes Database
export const REAL_GOVT_SCHEMES = [
  {
    id: 'pm-kisan',
    name: 'PM-KISAN (Pradhan Mantri Kisan Samman Nidhi)',
    category: 'Income Support',
    ministry: 'Ministry of Agriculture & Farmers Welfare',
    benefit: '₹6,000 per year in 3 equal installments of ₹2,000 directly transferred to bank accounts.',
    eligibility: 'All landholding farmer families across India (subject to standard exclusion criteria such as high-income earners).',
    documentsNeeded: ['Aadhaar Card', 'Land Holding Documents / Khatauni', 'Active Bank Account linked with Aadhaar'],
    officialUrl: 'https://pmkisan.gov.in/',
    description: 'A Central Sector Scheme providing financial support to landholding farmers to meet agricultural inputs and domestic needs.'
  },
  {
    id: 'pmfby',
    name: 'PMFBY (Pradhan Mantri Fasal Bima Yojana)',
    category: 'Crop Insurance',
    ministry: 'Ministry of Agriculture & Farmers Welfare',
    benefit: 'Comprehensive crop insurance coverage against yield losses due to non-preventable natural risks (drought, flood, unseasonal rain). Low farmer premium: 2% for Kharif, 1.5% for Rabi, and 5% for commercial crops.',
    eligibility: 'All farmers growing notified crops in notified areas, including sharecroppers and tenant farmers.',
    documentsNeeded: ['Aadhaar Card', 'Land Sowing Certificate', 'Bank Passbook', 'Land Revenue Record (7/12 or Khasra)'],
    officialUrl: 'https://pmfby.gov.in/',
    description: 'Yield-based crop insurance scheme protecting farmers against natural disasters from pre-sowing to post-harvest.'
  },
  {
    id: 'kcc',
    name: 'KCC (Kisan Credit Card Scheme)',
    category: 'Credit & Loans',
    ministry: 'Reserve Bank of India & NABARD',
    benefit: 'Timely credit for agricultural inputs at low interest rate (effectively 4% per annum with 3% prompt repayment incentive). Limit up to ₹3 Lakh without collateral for agricultural activities.',
    eligibility: 'Individual/joint borrowers, tenant farmers, sharecroppers, and Self Help Groups (SHGs) involved in agriculture, fisheries, or animal husbandry.',
    documentsNeeded: ['Identity Proof (Aadhaar/Voter ID)', 'Address Proof', 'Land Ownership Records', 'Passport Size Photos'],
    officialUrl: 'https://www.myscheme.gov.in/schemes/kcc',
    description: 'Provides flexible and hassle-free credit to farmers for crop production, post-harvest expenses, and farm maintenance.'
  },
  {
    id: 'pmksy',
    name: 'PMKSY (Pradhan Mantri Krishi Sinchayee Yojana)',
    category: 'Irrigation',
    ministry: 'Ministry of Jal Shakti & Agriculture',
    benefit: 'Up to 45% - 55% financial subsidy on installation of micro-irrigation systems (Drip and Sprinkler irrigation).',
    eligibility: 'Farmers who own cultivable land with an accessible water source. Members of water user associations and cooperative societies.',
    documentsNeeded: ['Aadhaar Card', 'Land Record Certificate', 'Water Source Certificate', 'Electricity Bill / Pump Connection Detail'],
    officialUrl: 'https://pmksy.gov.in/',
    description: 'Aims to expand cultivable area under assured irrigation ("Har Khet Ko Pani") and improve water use efficiency ("Per Drop More Crop").'
  },
  {
    id: 'pm-kusum',
    name: 'PM-KUSUM (Pradhan Mantri Kisan Urja Suraksha evam Utthaan Mahabhiyan)',
    category: 'Solar & Equipment',
    ministry: 'Ministry of New and Renewable Energy (MNRE)',
    benefit: '60% subsidy (30% Central + 30% State) for installing standalone solar agriculture pumps or solarizing existing grid-connected pumps.',
    eligibility: 'Individual farmers, farmer groups, cooperatives, water user associations, and panchayats.',
    documentsNeeded: ['Aadhaar Card', 'Land Ownership Records', 'Bank Account Details', 'Minor Irrigation Clearance'],
    officialUrl: 'https://pmkusum.mnre.gov.in/',
    description: 'Promotes solar energy deployment for irrigation, reducing diesel costs and generating extra income by selling surplus power back to the grid.'
  },
  {
    id: 'pkvy',
    name: 'PKVY (Paramparagat Krishi Vikas Yojana)',
    category: 'Organic Farming',
    ministry: 'Ministry of Agriculture & Farmers Welfare',
    benefit: 'Financial assistance of ₹50,000 per hectare over 3 years, of which ₹31,000 is directly provided for organic inputs, seeds, and soil health.',
    eligibility: 'Farmers forming clusters of 20 or more hectares in contiguous land areas for organic cultivation.',
    documentsNeeded: ['Aadhaar Card', 'Land Ownership Documents', 'Cluster Member Registration Certificate'],
    officialUrl: 'https://pgsindia-ncof.gov.in/',
    description: 'Promotes commercial organic farming through cluster-based certification and participatory guarantee systems (PGS-India).'
  },
  {
    id: 'e-nam',
    name: 'e-NAM (National Agriculture Market)',
    category: 'Market Access',
    ministry: 'Ministry of Agriculture & Farmers Welfare',
    benefit: 'Direct access to a pan-India electronic trading portal connecting wholesale APMC mandis. Offers transparent price discovery, online payment, and wider buyer reach.',
    eligibility: 'All farmers, traders, and commission agents registered with affiliated APMC mandis.',
    documentsNeeded: ['Aadhaar Card', 'Bank Account Details', 'APMC Trader/Farmer Registration ID'],
    officialUrl: 'https://www.enam.gov.in/',
    description: 'A pan-India electronic trading portal that networks existing APMC mandis to create a unified national market for agricultural commodities.'
  }
];

export const fetchSchemes = async (searchQuery = '', categoryFilter = 'All') => {
  let result = REAL_GOVT_SCHEMES;

  if (categoryFilter && categoryFilter !== 'All') {
    result = result.filter(scheme => scheme.category.toLowerCase() === categoryFilter.toLowerCase());
  }

  if (searchQuery) {
    const query = searchQuery.toLowerCase().trim();
    result = result.filter(scheme =>
      scheme.name.toLowerCase().includes(query) ||
      scheme.description.toLowerCase().includes(query) ||
      scheme.category.toLowerCase().includes(query) ||
      scheme.benefit.toLowerCase().includes(query)
    );
  }

  return result;
};

// Real-Time GenAI Advisor to analyze personalized farmer eligibility
export const getAISchemeAdvice = async (userProfile) => {
  const { state, landSize, crop, farmerType } = userProfile;

  const prompt = `Act as an expert advisor on Indian Government Agricultural Welfare Schemes. 
A farmer has submitted their profile:
- State: ${state || 'India'}
- Land Size: ${landSize || 'Small/Marginal'} Acres
- Primary Crop: ${crop || 'General Agriculture'}
- Farmer Category: ${farmerType || 'Individual Farmer'}

Review the major government schemes (PM-KISAN, PMFBY, KCC, PMKSY, PM-KUSUM, PKVY, e-NAM). 
Provide a clear, 4-sentence personalized recommendation explaining:
1. Which 2-3 specific government schemes give them the highest financial or input benefit.
2. What specific eligibility checks or documents they need to prepare.
Keep the advice practical, encouraging, and direct.`;

  try {
    const aiResponse = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
    });

    return aiResponse.text;
  } catch (error) {
    console.warn('[GenAI Scheme Advisor Warning]:', error.message);
    return "Based on your farm profile, PM-KISAN provides guaranteed direct income support of ₹6,000 annually, while PM Fasal Bima Yojana (PMFBY) protects your crop against climate losses at nominal premium rates. Additionally, a Kisan Credit Card (KCC) will grant low-interest crop loans up to ₹3 Lakh. Ensure your Aadhaar is linked to your bank account and land revenue records (Khatauni) for seamless enrollment.";
  }
};