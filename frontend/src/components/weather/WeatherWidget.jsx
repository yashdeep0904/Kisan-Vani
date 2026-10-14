import { CloudSun, CloudRain, Droplets, Wind } from 'lucide-react';
import Card from '../ui/Card';

export default function WeatherWidget({ currentTemp, condition, humidity, wind }) {
  const isRaining = condition.toLowerCase().includes('rain');

  return (
    <Card className="flex items-center justify-between p-4 bg-gradient-to-br from-slate-900 to-slate-800 border-slate-700">
      <div className="flex items-center gap-4">
        <div className={`p-3 rounded-full ${isRaining ? 'bg-blue-500/20 text-blue-400' : 'bg-amber-500/20 text-amber-400'}`}>
          {isRaining ? <CloudRain className="h-8 w-8" /> : <CloudSun className="h-8 w-8" />}
        </div>
        <div>
          <h4 className="text-3xl font-extrabold text-white">{currentTemp}°C</h4>
          <p className="text-xs font-semibold text-slate-400">{condition}</p>
        </div>
      </div>
      
      <div className="flex flex-col gap-2 border-l border-slate-700 pl-4">
        <div className="flex items-center gap-2 text-xs text-slate-300">
          <Droplets className="h-3.5 w-3.5 text-blue-400" />
          <span>{humidity}% Humidity</span>
        </div>
        <div className="flex items-center gap-2 text-xs text-slate-300">
          <Wind className="h-3.5 w-3.5 text-slate-400" />
          <span>{wind} km/h</span>
        </div>
      </div>
    </Card>
  );
}