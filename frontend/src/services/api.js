// src/services/api.js

// Live Render backend fallback URL (without trailing slash)
const LIVE_BACKEND_URL = 'https://kisan-vani-server.onrender.com';

export const API_BASE_URL = import.meta.env.VITE_API_URL || LIVE_BACKEND_URL;

/**
 * Universal safe response handler that prevents "Unexpected end of JSON input" 
 * and "Unexpected token '<'" crashes.
 */
const handleResponse = async (response, fullUrl) => {
  const rawText = await response.text();
  let data = {};

  try {
    data = rawText ? JSON.parse(rawText) : {};
  } catch (err) {
    console.error(`[API Parse Error] Non-JSON response received from ${fullUrl}:`, rawText);
    throw new Error(`Server connection error (${response.status}). Please verify the backend service is running.`);
  }

  if (!response.ok) {
    throw new Error(data.error || `API Request Failed with status ${response.status}`);
  }

  return data;
};

/**
 * Core HTTP Request Wrapper
 */
const customFetch = async (endpoint, options = {}) => {
  const token = localStorage.getItem('kisan_token');
  const headers = { ...options.headers };

  // Attach JWT Bearer token if present
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  // Set application/json only if body is NOT FormData
  if (!(options.body instanceof FormData) && !headers['Content-Type']) {
    headers['Content-Type'] = 'application/json';
  }

  const formattedEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
  const fullUrl = `${API_BASE_URL}${formattedEndpoint}`;

  const res = await fetch(fullUrl, {
    ...options,
    headers,
  });

  return handleResponse(res, fullUrl);
};

export const api = {
  // Authentication Routes
  register: async (userData) => {
    return customFetch('/api/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  },

  login: async (credentials) => {
    return customFetch('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
  },

  logout: async () => {
    return customFetch('/api/auth/logout', { 
      method: 'POST' 
    });
  },

  // Real-time Mandi Prices Intelligence
  getMandiPrices: async (district = 'Rohtak', crop = 'Wheat') => {
    const query = `district=${encodeURIComponent(district)}&crop=${encodeURIComponent(crop)}`;
    return customFetch(`/api/mandi?${query}`);
  },

  // Real-time Weather Data
  getWeather: async (lat = '28.6139', lon = '77.2090') => {
    return customFetch(`/api/weather?lat=${lat}&lon=${lon}`);
  },

  // Government Schemes Intelligence (RAG)
  querySchemes: async (query) => {
    return customFetch('/api/schemes', {
      method: 'POST',
      body: JSON.stringify({ query }),
    });
  },

  // Multimodal Crop Diagnostics via Gemini
  diagnoseCrop: async (imageFile) => {
    const formData = new FormData();
    formData.append('image', imageFile);

    return customFetch('/api/diagnose', {
      method: 'POST',
      body: formData, // Browser automatically sets multipart/form-data boundary
    });
  }
};