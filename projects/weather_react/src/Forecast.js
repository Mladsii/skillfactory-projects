function Forecast({ forecast, city }) {
  const currentWeather = forecast.current;
  const dailyForecast = forecast.daily.slice(1, 6); // Прогноз на ближайшие 5 дней

  return (
    <div className="forecast">
      <h2 className="forecast-city">{city}</h2>

      {/* Текущая погода */}
      <div className="current-weather">
        <h3>Сейчас</h3>
        <p>Температура: {currentWeather.temp}°C</p>
        <p>Ощущается как: {currentWeather.feels_like}°C</p>
        <p>Погода: {currentWeather.weather[0].description}</p>
      </div>

      {/* Прогноз на 5 дней */}
      <div className="daily-forecast">
        <h3>Ближайшие 5 дней</h3>
        <ul>
          {dailyForecast.map((day, index) => (
            <li key={index} className="forecast-item">
              <span className="forecast-date">{new Date(day.dt * 1000).toLocaleDateString()}</span>
              <span className="forecast-temp">Температура: {day.temp.day}°C</span>
              <span className="forecast-description">Погода: {day.weather[0].description}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default Forecast;