import React, { useState } from 'react';

const Carousel = ({ items }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  // Функция для перехода к следующему слайду
  const handleNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % items.length);
  };

  // Функция для перехода к предыдущему слайду
  const handlePrev = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + items.length) % items.length);
  };

  return (
    <div className="carousel">
      {/* Кнопки управления */}
      <div className="carousel__controls">
        <button className="carousel__prev" onClick={handlePrev}>
          {'❮'}
        </button>
        <button className="carousel__next" onClick={handleNext}>
          {'❯'}
        </button>
      </div>

      {/* Обертка для слайдов */}
      <div
        className="carousel__wrapper"
        style={{ transform: `translateX(-${currentIndex * 100}%)` }}
      >
        {items.map((item, index) => (
          <div key={index} className="carousel__item">
            <img src={item.icon} alt={item.title} className="carousel__icon" />
            <h3 className="carousel__title">{item.title}</h3>
            <p className="carousel__text">{item.text}</p>
          </div>
        ))}
      </div>

      {/* Индикаторы слайдов */}
      <div className="carousel__indicators">
        {items.map((_, index) => (
          <span
            key={index}
            className={`carousel__indicator ${index === currentIndex ? 'active' : ''}`}
            onClick={() => setCurrentIndex(index)}
          ></span>
        ))}
      </div>
    </div>
  );
};

export default Carousel;