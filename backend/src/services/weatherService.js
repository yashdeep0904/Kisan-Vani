import fetch from 'node-fetch';

export const fetchWeatherData = async (lat, lon) => {
  const apiKey = process.env.WEATHER_API_KEY || process.env.OPENWEATHER_API_KEY;
  
  if (!apiKey) {
    throw new Error('Server configuration missing: WEATHER_API_KEY');
  }

  // OpenWeatherMap 5-Day/3-Hour Forecast endpoint (Free Tier)
  const url = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=metric&appid=${apiKey}`;
  
  const response = await fetch(url);
  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || 'Failed to fetch telemetry from OpenWeatherMap');
  }

  const dailyMap = {};
  
  (data.list || []).forEach((item) => {
    const date = item.dt_txt.split(' ')[0]; 
    if (!dailyMap[date]) {
      dailyMap[date] = {
        temps: [],
        conditions: [],
        windSpeeds: [],
        rain: 0,
      };
    }
    dailyMap[date].temps.push(item.main.temp);
    dailyMap[date].conditions.push(item.weather[0].description);
    dailyMap[date].windSpeeds.push(item.wind.speed * 3.6); 
    
    if (item.rain && item.rain['3h']) {
      dailyMap[date].rain += item.rain['3h'];
    }
  });

  const forecastArray = Object.keys(dailyMap).map((dateStr, index) => {
    const dayData = dailyMap[dateStr];
    
    const maxTemp = Math.round(Math.max(...dayData.temps));
    const minTemp = Math.round(Math.min(...dayData.temps));
    const avgWind = Math.round(dayData.windSpeeds.reduce((a, b) => a + b, 0) / dayData.windSpeeds.length);
    
    const condition = dayData.conditions[0] || 'clear sky';
    const code = condition.includes('rain') ? 61 : condition.includes('cloud') ? 3 : 0;

    const dateObj = new Date(dateStr);
    const dayName = index === 0 ? 'Today' : dateObj.toLocaleDateString('en-US', { weekday: 'short' });
    const monthDay = dateObj.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });

    return {
      code,
      maxTemp,
      minTemp,
      precipitation: Number(dayData.rain.toFixed(1)),
      wind: avgWind,
      condition,
      dayName,
      monthDay
    };
  });

  return forecastArray;
};