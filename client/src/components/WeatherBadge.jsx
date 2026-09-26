
import { useState, useEffect } from 'react';
import { CloudRain } from 'lucide-react';

export default function WeatherBadge({ location = "Kolkata" }) {
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchWeather = async () => {
      try {
        // We use the location prop, but fallback to a default city if the venue name is too obscure
        const API_KEY = import.meta.env.VITE_WEATHER_API_KEY;
        const res = await fetch(`https://api.weatherapi.com/v1/current.json?key=${API_KEY}&q=${location}`);
        const data = await res.json();
        
        if (data.current) {
          setWeather(data);
        }
      } catch (error) {
        console.error("Weather fetch failed", error);
      } finally {
        setLoading(false);
      }
    };

    fetchWeather();
  }, [location]);

  if (loading) return <div className="text-neutral-500 text-xs animate-pulse">Checking skies...</div>;
  if (!weather) return null;

  return (
    <div className="flex items-center gap-3 bg-[#0f0f13] border border-neutral-800 rounded-xl px-4 py-2 w-fit">
      <img 
        src={weather.current.condition.icon} 
        alt="weather icon" 
        className="w-8 h-8"
      />
      <div>
        <p className="text-white font-bold text-sm flex items-center gap-1">
          {weather.current.temp_c}°C
        </p>
        <p className="text-[10px] text-neutral-400 font-bold uppercase tracking-wider">
          {weather.current.condition.text}
        </p>
      </div>
    </div>
  );
}