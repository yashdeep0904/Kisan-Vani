import { useState, useEffect } from 'react';
import { api } from '../services/api';
import { CloudSun, Cloud, Sun, CloudRain, CloudLightning, Snowflake, CloudFog, MapPin, Loader2, Wind, Droplets, Navigation, CalendarDays } from 'lucide-react';
import Card from '../components/ui/Card';

export default function WeatherForecast() {
  const [forecast, setForecast] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [locationName, setLocationName] = useState('Detecting location...');

  useEffect(() => {
    const fetchWeather = async (lat, lon, districtName) => {
      try {
        const response = await api.getWeather(lat, lon);
        setForecast(response?.data || response || []);
        if (districtName) setLocationName(districtName);
      } catch (err) {
        setError(err.message || 'Failed to load live meteorological data');
      } finally {
        setLoading(false);
      }
    };

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          try {
            const res = await fetch(`[https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=$](https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=$){latitude}&longitude=${longitude}&localityLanguage=en`);
            const geoData = await res.json();
            const district = geoData.locality || geoData.city || 'Your Location';
            fetchWeather(latitude, longitude, district);
          } catch (e) {
            fetchWeather(latitude, longitude, 'Your Location');
          }
        },
        () => fetchWeather(28.6139, 77.2090, 'New Delhi (Default)')
      );
    } else {
      fetchWeather(28.6139, 77.2090, 'New Delhi (Default)');
    }
  }, []);

  const getWeatherIcon = (code, className) => {
    if (code === 0) return <Sun className={className} />;
    if (code === 1 || code === 2) return <CloudSun className={className} />;
    if (code === 3) return <Cloud className={className} />;
    if (code === 45 || code === 48) return <CloudFog className={className} />;
    if (code >= 51 && code <= 67) return <CloudRain className={className} />;
    if (code >= 71 && code <= 77) return <Snowflake className={className} />;
    if (code >= 80 && code <= 82) return <CloudRain className={className} />;
    if (code >= 95 && code <= 99) return <CloudLightning className={className} />;
    return <CloudSun className={className} />; 
  };

  const getTemperatureColor = (temp) => {
    if (temp >= 35) return 'text-rose-500';
    if (temp >= 25) return 'text-amber-400';
    if (temp >= 15) return 'text-emerald-400';
    if (temp >= 5) return 'text-blue-400';
    return 'text-indigo-400';
  };

  const today = forecast[0];
  const upcomingDays = forecast.slice(1);

  return (
    <div className="space-y-6 py-4 max-w-6xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white flex items-center gap-3">
            <CloudSun className="h-8 w-8 text-blue-400" />
            Live Agricultural Forecast
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Real-time meteorological telemetry for optimal crop planning.
          </p>
        </div>
        
        <div className="flex items-center gap-2 bg-blue-500/10 border border-blue-500/30 px-4 py-2 rounded-xl text-xs text-blue-400 self-start">
          <Navigation className="h-3.5 w-3.5 animate-pulse" />
          <span>Location: <strong>{locationName}</strong></span>
        </div>
      </div>

      {error && (
        <div className="p-4 bg-rose-500/10 border border-rose-500/30 rounded-xl text-rose-400 text-sm">
          {error}
        </div>
      )}

      {loading ? (
        <div className="flex flex-col items-center justify-center p-12 gap-3 text-slate-400">
          <Loader2 className="h-8 w-8 text-blue-400 animate-spin" />
          <p className="text-sm">Connecting to global weather satellites...</p>
        </div>
      ) : forecast.length > 0 ? (
        <div className="space-y-6">
          <div className="bg-gradient-to-br from-blue-950 to-slate-900 border border-blue-900/50 rounded-2xl p-6 sm:p-8 relative overflow-hidden shadow-2xl">
            <div className="absolute top-0 right-0 p-8 opacity-10">
              {getWeatherIcon(today.code, "h-48 w-48 text-blue-300")}
            </div>
            
            <div className="relative z-10">
              <div className="flex items-center gap-2 text-blue-400 font-bold text-sm tracking-widest uppercase mb-4">
                <CalendarDays className="h-4 w-4" /> Current Conditions • {today.monthDay}
              </div>
              
              <div className="flex flex-col sm:flex-row sm:items-end gap-6 mb-8">
                <div className="flex items-center gap-4">
                  {getWeatherIcon(today.code, "h-20 w-20 text-white")}
                  <div>
                    <h2 className="text-6xl font-extrabold text-white tracking-tighter">
                      {today.maxTemp}°<span className="text-3xl text-slate-400 font-medium">C</span>
                    </h2>
                    <p className="text-xl text-slate-200 font-medium mt-1 capitalize">{today.condition}</p>
                  </div>
                </div>
                <div className="text-slate-400 text-lg sm:pb-2 font-medium">
                  Low: <span className="text-white">{today.minTemp}°C</span>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 border-t border-blue-900/50 pt-6">
                <div className="flex items-center gap-3">
                  <Wind className="h-8 w-8 text-blue-400 p-1.5 bg-blue-500/10 rounded-lg" />
                  <div>
                    <p className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Wind Speed</p>
                    <p className="text-sm font-extrabold text-white">{today.wind} km/h</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Droplets className="h-8 w-8 text-blue-400 p-1.5 bg-blue-500/10 rounded-lg" />
                  <div>
                    <p className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Precipitation</p>
                    <p className="text-sm font-extrabold text-white">{today.precipitation} mm</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
              <CalendarDays className="h-5 w-5 text-slate-400" />
              {upcomingDays.length}-Day Extended Outlook
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
              {upcomingDays.map((day, idx) => (
                <Card key={idx} className="border-slate-800 bg-slate-900/50 flex flex-col items-center text-center p-4 hover:border-blue-500/50 transition-colors">
                  <div className="text-slate-300 font-bold text-sm mb-1">{day.dayName}</div>
                  <div className="text-slate-500 text-xs mb-3">{day.monthDay}</div>
                  
                  {getWeatherIcon(day.code, "h-10 w-10 text-blue-400 mb-3")}
                  
                  <div className="text-xs text-slate-300 font-medium h-8 flex items-center justify-center capitalize mb-3">
                    {day.condition}
                  </div>
                  
                  <div className="flex items-center justify-between w-full border-t border-slate-800 pt-3 mt-auto">
                    <span className="text-slate-400 text-xs flex items-center gap-1">
                      L: <strong className="text-white">{day.minTemp}°</strong>
                    </span>
                    <span className="text-slate-400 text-xs flex items-center gap-1">
                      H: <strong className={getTemperatureColor(day.maxTemp)}>{day.maxTemp}°</strong>
                    </span>
                  </div>
                </Card>
              ))}
            </div>
          </div>
          
        </div>
      ) : null}
    </div>
  );
}