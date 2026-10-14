const handleResponse = async (response) => {
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.error || 'API Request Failed');
  }
  return data;
};

export const api = {
  register: async (userData) => {
    const res = await fetch('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData),
    });
    return handleResponse(res);
  },
  
  login: async (credentials) => {
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(credentials),
    });
    return handleResponse(res);
  },

  logout: async () => {
    const res = await fetch('/api/auth/logout', { method: 'POST' });
    return handleResponse(res);
  },

  // Real-time Mandi Prices from data.gov.in
  getMandiPrices: async (search = '') => {
    const res = await fetch(`/api/mandi?search=${encodeURIComponent(search)}`);
    return handleResponse(res);
  },

  // Real-time Weather from OpenWeatherMap
  getWeather: async (lat, lon) => {
    const res = await fetch(`/api/weather?lat=${lat}&lon=${lon}`);
    return handleResponse(res);
  },

  // AI Scheme Intelligence (RAG)
  querySchemes: async (query) => {
    const res = await fetch('/api/schemes', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query }),
    });
    return handleResponse(res);
  },

  // Multimodal Crop Diagnostics via Gemini 2.0 Flash
  diagnoseCrop: async (imageFile) => {
    const formData = new FormData();
    formData.append('image', imageFile);

    const res = await fetch('/api/diagnose', {
      method: 'POST',
      body: formData,
    });
    return handleResponse(res);
  }
};