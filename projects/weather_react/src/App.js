import React, { useState, useEffect } from 'react';
import CitySelector from './CitySelector';
import Forecast from './Forecast';
import './index.css';

const API_KEY = process.env.REACT_APP_OPENWEATHER_API_KEY || '';

function App() {
  const [city, setCity] = useState('Moscow'); // Город по умолчанию
  const [forecast, setForecast] = useState(null);
  const [error, setError] = useState(''); // Для отображения ошибок

  const fetchWeather = async (cityName) => {
    try {
      setError('');

      const geoResponse = await fetch(
        `https://api.openweathermap.org/geo/1.0/direct?q=${cityName}&limit=1&appid=${API_KEY}`
      );
      if (!geoResponse.ok) {
        throw new Error(`Ошибка геокодирования: ${geoResponse.status}`);
      }
      const locationData = await geoResponse.json();
      if (!locationData || locationData.length === 0) {
        throw new Error('Город не найден');
      }

      const { lat, lon } = locationData[0];

      const weatherResponse = await fetch(
        `https://api.openweathermap.org/data/3.0/onecall?lat=${lat}&lon=${lon}&exclude=minutely,hourly&units=metric&appid=${API_KEY}`
      );
      if (!weatherResponse.ok) {
        throw new Error(`Ошибка получения погоды: ${weatherResponse.status}`);
      }
      const weatherData = await weatherResponse.json();

      setForecast(weatherData);
      setCity(cityName);
    } catch (error) {
      console.error('Ошибка при получении данных о погоде:', error.message);
      setError(error.message);
    }
  };

  // Автоматическая загрузка погоды для города по умолчанию
  useEffect(() => {
    fetchWeather(city);
  }, [city]);

  return (
    <div className="app">
      <h1 className="app-title">Прогноз погоды</h1>
      <CitySelector onCitySelect={(newCity) => { setCity(newCity); }} />
      {error && <p className="error-message">{error}</p>}
      {forecast && <Forecast forecast={forecast} city={city} />}
    </div>
  );
}

export default App;