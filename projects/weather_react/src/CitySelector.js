import React, { useState } from 'react';

function CitySelector({ onCitySelect }) {
  const [city, setCity] = useState('Moscow'); // Выбранный город по умолчанию

  const cities = ['Moscow', 'Tokyo', 'Washington', 'Vienna', 'Kyiv']; // Список городов

  const handleCityChange = (e) => {
    setCity(e.target.value);
    onCitySelect(e.target.value); // Передаём выбранный город в родительский компонент
  };

  return (
    <div className="city-selector">
      <label htmlFor="city-select" className="city-label">
        Выберите город:
      </label>
      <select
        id="city-select"
        value={city}
        onChange={handleCityChange}
        className="city-select"
      >
        {cities.map((c, i) => (
          <option key={i} value={c}>
            {c}
          </option>
        ))}
      </select>
    </div>
  );
}

export default CitySelector;