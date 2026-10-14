export const fetchWeatherData = async (lat, lon) => {
  // Free, no-API-key endpoint offering accurate 10-day agricultural forecasts
  const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&daily=weathercode,temperature_2m_max,temperature_2m_min,precipitation_sum,windspeed_10m_max&timezone=auto&forecast_days=10`;

  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error('Weather API unreachable');
    
    const data = await response.json();
    const daily = data.daily;

    const interpretWeatherCode = (code) => {
      const weatherMap = {
        0: 'Clear sky',
        1: 'Mainly clear', 2: 'Partly cloudy', 3: 'Overcast',
        45: 'Fog', 48: 'Depositing rime fog',
        51: 'Light Drizzle', 53: 'Moderate Drizzle', 55: 'Dense Drizzle',
        61: 'Slight Rain', 63: 'Moderate Rain', 65: 'Heavy Rain',
        71: 'Slight Snowfall', 73: 'Moderate Snowfall', 75: 'Heavy Snowfall',
        80: 'Slight Showers', 81: 'Moderate Showers', 82: 'Violent Showers',
        95: 'Thunderstorm', 96: 'Thunderstorm & Hail', 99: 'Heavy Thunderstorm'
      };
      return weatherMap[code] || 'Unknown Condition';
    };

    return daily.time.map((date, index) => {
      const dateObj = new Date(date);
      return {
        date: date,
        dayName: index === 0 ? 'Today' : dateObj.toLocaleDateString('en-US', { weekday: 'long' }),
        monthDay: dateObj.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        maxTemp: Math.round(daily.temperature_2m_max[index]),
        minTemp: Math.round(daily.temperature_2m_min[index]),
        precipitation: daily.precipitation_sum[index] || 0,
        wind: Math.round(daily.windspeed_10m_max[index]),
        condition: interpretWeatherCode(daily.weathercode[index]),
        code: daily.weathercode[index]
      };
    });
  } catch (error) {
    console.error('Weather Service Error:', error);
    throw new Error('Failed to fetch 10-day weather forecast');
  }
};