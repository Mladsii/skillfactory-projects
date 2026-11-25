// src/pages/Authorization.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';

// Подключаем CSS
import '../styles/authorization.css'; // Убедитесь, что путь к файлу правильный

// Импортируем изображения
import authImage from '../assets/images/9ae2eaf6e8553f64c1165a932fabc177.jpeg';
import googleIcon from '../assets/images/Google__G__logo.webp';
import facebookIcon from '../assets/images/Facebook_Logo_(2019).png.webp';

const Authorization = () => {
  const [login, setLogin] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch('https://gateway.scan-interfax.ru/api/v1/account/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ login, password }),
      });

      if (!response.ok) {
        throw new Error('Неверный логин или пароль');
      }

      const data = await response.json();

      // Сохраняем данные авторизации
      localStorage.setItem('isLoggedIn', 'true');
      localStorage.setItem('userLogin', login);
      localStorage.setItem('accessToken', data.accessToken);

      // Устанавливаем тариф Beginner для пользователя
      localStorage.setItem('currentTariff', 'beginner');

      // Перенаправляем пользователя на главную страницу
      navigate('/');
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <div>
      {/* Шапка */}
      <Header />

      {/* Основной контент */}
      <main className="authorization">
        <div className="container">
          <div className="authorization__inner">
            {/* Иллюстрация */}
            <div className="authorization__image">
              <img
                src={authImage} // Используем импортированное изображение
                alt="Иллюстрация авторизации"
              />
            </div>

            {/* Форма авторизации */}
            <div className="authorization__form">
              <h2 className="authorization__title">
                Для оформления подписки на тариф, необходимо авторизоваться.
              </h2>
              <form className="authorization__login-form" onSubmit={handleSubmit}>
                <label htmlFor="login" className="authorization__label">
                  Логин или номер телефона:
                </label>
                <input
                  type="text"
                  id="login"
                  className="authorization__input"
                  placeholder="Введите логин или телефон"
                  value={login}
                  onChange={(e) => setLogin(e.target.value)}
                  required
                />

                <label htmlFor="password" className="authorization__label">
                  Пароль:
                </label>
                <input
                  type="password"
                  id="password"
                  className="authorization__input"
                  placeholder="Введите пароль"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />

                <button type="submit" className="authorization__btn">
                  Войти
                </button>

                <p className="authorization__forgot-password">
                  <a href="#" className="authorization__forgot-link">
                    Восстановить пароль
                  </a>
                </p>

                {/* Социальные кнопки */}
                <div className="authorization__social">
                  <p className="authorization__social-title">Войти через:</p>
                  <div className="authorization__social-buttons">
                    <button className="authorization__social-btn">
                      <img src={googleIcon} alt="Google" /> {/* Используем импортированное изображение */}
                    </button>
                    <button className="authorization__social-btn">
                      <img src={facebookIcon} alt="Facebook" /> {/* Используем импортированное изображение */}
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </main>

      {/* Подвал */}
      <Footer />
    </div>
  );
};

export default Authorization;