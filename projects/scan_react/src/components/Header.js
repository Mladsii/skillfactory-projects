// src/components/Header.js
import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import logo from '../assets/images/a21cf0e37634bf7f262554f86388e0d5.png';
import avatar from '../assets/images/167629632911850940.png';

const Header = () => {
  const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
  const userLogin = localStorage.getItem('userLogin');
  const [usedCompanyCount, setUsedCompanyCount] = useState(0); // Использованные компании
  const [companyLimit, setCompanyLimit] = useState(100); // Лимит компаний
  const navigate = useNavigate();

  // Функция выхода из системы
  const handleLogout = () => {
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('userLogin');
    navigate('/authorization');
  };

  // Функция для получения информации об аккаунте
  const fetchAccountInfo = async () => {
    const token = localStorage.getItem('accessToken'); // Получаем токен из localStorage
    if (!token) {
      console.error('Токен не найден. Пользователь не авторизован.');
      return;
    }

    try {
      const response = await fetch('https://gateway.scan-interfax.ru/api/v1/account/info', {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error(`Ошибка: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      const usedCount = data?.eventFiltersInfo?.usedCompanyCount || 0;
      const limit = data?.eventFiltersInfo?.companyLimit || 100;

      // Обновляем состояние
      setUsedCompanyCount(usedCount);
      setCompanyLimit(limit);
    } catch (error) {
      console.error('Ошибка при получении данных аккаунта:', error.message);

      // Если API недоступен, используем резервные значения
      setUsedCompanyCount(0);
      setCompanyLimit(100);
    }
  };

  // Загрузка данных при монтировании компонента
  useEffect(() => {
    if (isLoggedIn) {
      fetchAccountInfo();
    }
  }, [isLoggedIn]);

  return (
    <header className="header">
      <div className="container">
        <div className="header__inner">
          {/* Логотип */}
          <Link to="/" className="header__logo">
            <img src={logo} alt="Логотип" />
          </Link>

          {/* Навигация */}
          <nav className="header__nav">
            <ul className="nav__list">
              <li className="nav__item">
                <Link to="/" className="nav__link">
                  Главная
                </Link>
              </li>
              <li className="nav__item">
                <Link to="#" className="nav__link">
                  Тарифы
                </Link>
              </li>
              <li className="nav__item">
                <Link to="#" className="nav__link">
                  FAQ
                </Link>
              </li>
            </ul>
          </nav>

          {/* Блок аутентификации */}
          <div className="header__auth">
            {isLoggedIn ? (
              <div className="header__user-profile">
                <div className="header__user-avatar">
                  <img src={avatar} alt="Аватар пользователя" />
                </div>
                <span className="header__user-name">{userLogin || 'Пользователь'}</span>

                {/* Информация о лимитах */}
                <div className="header__user-info">
                  <span className="header__used-companies">
                    Использовано компаний: <strong>{usedCompanyCount}</strong>
                  </span>
                  <span className="header__company-limit">
                    Лимит по компаниям: <strong>{companyLimit}</strong>
                  </span>
                </div>

                {/* Кнопка выхода */}
                <button className="header__btn header__btn--logout" onClick={handleLogout}>
                  Выйти
                </button>
              </div>
            ) : (
              <>
                <Link to="/authorization" className="header__btn header__btn--login">
                  Войти
                </Link>
                <Link to="#" className="header__btn header__btn--register">
                  Зарегистрироваться
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;