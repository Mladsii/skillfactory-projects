import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import Carousel from '../components/Carousel';

// Импортируем изображения для карусели
import icon1 from '../assets/images/free-icon-data-safety-18675386.png';
import icon2 from '../assets/images/free-icon-data-collection-18675420.png';
import icon3 from '../assets/images/free-icon-data-collection-18675418.png';
import icon4 from '../assets/images/free-icon-data-collection-18675418.png';



const Home = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentTariff, setCurrentTariff] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    try {
      const authStatus = localStorage.getItem('isLoggedIn') === 'true';
      setIsLoggedIn(authStatus);

      if (authStatus) {
        const userTariff = localStorage.getItem('currentTariff');
        setCurrentTariff(userTariff || null);
      } else {
        setCurrentTariff(null);
      }
    } catch (error) {
      console.error('Ошибка при проверке авторизации:', error.message);
    }
  }, []);

  const handleRequestData = () => {
    if (isLoggedIn) {
      navigate('/search');
    } else {
      navigate('/authorization');
    }
  };

  const carouselItems = [
    { icon: icon1, title: 'Скорость обработки', text: 'Высокая и оперативная скорость обработки заявки' },
    { icon: icon2, title: 'База данных', text: 'Огромная комплексная база данных, обеспечивающая объективный ответ на запрос' },
    { icon: icon3, title: 'Конфиденциальность', text: 'Защита конфиденциальных сведений, не подлежащих разглашению по федеральному законодательству' },
    { icon: icon4, title: 'Увереность', text: 'Лучшие на рынке!' },

  ];

  const pricingCards = [
    {
      tariff: 'beginner',
      title: 'Beginner',
      priceCurrent: '799 ₽',
      priceOld: '1 200 ₽',
      description: 'или 150 ₽/мес. при рассрочке на 24 мес.',
      features: ['Безлимитная история запросов', 'Безопасная сделка', 'Поддержка 24/7'],
    },
    {
      tariff: 'pro',
      title: 'Pro',
      priceCurrent: '1 299 ₽',
      priceOld: '2 600 ₽',
      description: 'или 279 ₽/мес. при рассрочке на 24 мес.',
      features: ['Все пункты тарифа Beginner', 'Экспорт истории', 'Рекомендации по приоритетам'],
    },
    {
      tariff: 'business',
      title: 'Business',
      priceCurrent: '2 379 ₽',
      priceOld: '3 700 ₽',
      description: 'В тариф входит:',
      features: ['Все пункты тарифа Pro', 'Безлимитное количество запросов', 'Приоритетная поддержка'],
    },
  ];

  return (
    <div>
      <Header />
      <main className="main">
        <div className="container">
          <h1 className="main__title">Профессиональный анализ публикаций</h1>
          <p className="main__description">
            Получите доступ к данным и анализу публикаций в удобном формате.
          </p>
          <button
            className={`main__btn ${isLoggedIn ? '' : 'main__btn--disabled'}`}
            onClick={handleRequestData}
            disabled={!isLoggedIn}
          >
            Запросить данные
          </button>
          <Carousel items={carouselItems} key={JSON.stringify(carouselItems)} />
        </div>
      </main>
      <section className="pricing">
        <div className="container">
          <h2 className="pricing__title">Наши тарифы</h2>
          <div className="pricing__cards">
            {pricingCards.map((card) => (
              <div
                key={card.tariff}
                className={`pricing-card ${isLoggedIn && currentTariff === card.tariff ? 'current' : ''}`}
                data-tariff={card.tariff}
              >
                <div className="pricing-card__header">
                  <h3 className="pricing-card__title">{card.title}</h3>
                  <span
                    className={`pricing-card__badge ${
                      isLoggedIn && currentTariff === card.tariff ? '' : 'hidden'
                    }`}
                  >
                    Текущий тариф
                  </span>
                </div>
                <div className="pricing-card__price">
                  <span className="pricing-card__price-current">{card.priceCurrent}</span>
                  <del className="pricing-card__price-old">{card.priceOld}</del>
                </div>
                <p className="pricing-card__description">{card.description}</p>
                <ul className="pricing-card__features">
                  {card.features.map((feature, index) => (
                    <li key={index}>{feature}</li>
                  ))}
                </ul>
                <button className="pricing-card__btn">
                  {isLoggedIn && currentTariff === card.tariff ? 'Перейти в личный кабинет' : 'Подробнее'}
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
};

export default Home;