// src/components/Footer.js
import React from 'react';
import logo from '../assets/images/6465f70937726c512fe72d7d2f4a4889.png'; // Импортируем изображение

const Footer = () => {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer__inner">
          {/* Блок с логотипом и описанием */}
          <div className="footer__about">
            <a href="#" className="footer__logo">
              <img src={logo} alt="Логотип" /> {/* Используем импортированное изображение */}
            </a>
            <p className="footer__description">
              Комплексный анализ публикаций, получение данных в формате PDF на электронную почту.
            </p>
          </div>

          {/* Блок с навигацией */}
          <div className="footer__nav">
            <h4 className="footer__title">Навигация</h4>
            <ul className="footer__list">
              <li><a href="/" className="footer__link">Главная</a></li>
              <li><a href="#" className="footer__link">Тарифы</a></li>
              <li><a href="#" className="footer__link">FAQ</a></li>
            </ul>
          </div>

          {/* Блок с контактами */}
          <div className="footer__contact">
            <h4 className="footer__title">Контакты</h4>
            <p className="footer__info">Адрес: г. Москва, Цветной б-р, 40</p>
            <p className="footer__info">Телефон: +7 (495) 771-21-11</p>
            <p className="footer__info">Email: info@skan.ru</p>
          </div>

          {/* Блок с формой подписки */}
          <div className="footer__subscribe">
            <h4 className="footer__title">Подпишитесь на рассылку</h4>
            <form className="footer__form">
              <input type="email" className="footer__input" placeholder="Введите ваш email" />
              <button type="submit" className="footer__btn">Подписаться</button>
            </form>
          </div>
        </div>

        {/* Копирайт */}
        <div className="footer__copyright">
          <p>&copy; 2023 Все права защищены.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;