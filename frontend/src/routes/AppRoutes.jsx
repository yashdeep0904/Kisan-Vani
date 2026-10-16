import { Routes, Route } from 'react-router-dom';
import Home from '../pages/Home';
import Diagnostics from '../pages/Diagnostics';
import MandiPrices from '../pages/MandiPrices';
import WeatherForecast from '../pages/WeatherForecast';
import Schemes from '../pages/Schemes';
import Profile from '../pages/Profile';
import InterviewRoom from '../pages/InterviewRoom';

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/diagnose" element={<Diagnostics />} />
      <Route path="/mandi" element={<MandiPrices />} />
      <Route path="/weather" element={<WeatherForecast />} />
      <Route path="/schemes" element={<Schemes />} />
      <Route path="/profile" element={<Profile />} />
      <Route path="/interview" element={<InterviewRoom />} />
    </Routes>
  );
}