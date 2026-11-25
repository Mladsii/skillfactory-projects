import React, { useState } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';

const Search = () => {
  const [formData, setFormData] = useState({
    inn: '',
    documentCount: '',
    startDate: '',
    endDate: '',
    fullness: false,
    businessContext: false,
    mainRole: false,
    tone: 'any',
    riskFactors: false,
    marketNews: false,
    announcements: false,
    newsSummaries: false,
  });

  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  // Функция для изменения состояния формы
  const handleChange = (e) => {
    const { name, type, checked, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  // Валидация формы
  const validateForm = () => {
    let isValid = true;
    const newErrors = {};

    // Проверка ИНН
    if (!/^\d{10}$|^\d{12}$/.test(formData.inn)) {
      newErrors.innError = 'ИНН должен содержать 10 или 12 цифр.';
      isValid = false;
    }

    // Проверка диапазона дат
    const today = new Date();
    const startDate = new Date(formData.startDate);
    const endDate = new Date(formData.endDate);

    if (
      !formData.startDate ||
      !formData.endDate ||
      startDate > endDate ||
      startDate > today ||
      endDate > today
    ) {
      newErrors.dateRangeError =
        'Дата начала не может быть позже даты конца, и даты не должны быть в будущем.';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  // Обработка отправки формы
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsLoading(true); // Включаем индикатор загрузки

    try {
      // Формируем данные для API
      const requestData = {
        issueDateInterval: {
          startDate: `${formData.startDate}T00:00:00+03:00`,
          endDate: `${formData.endDate}T23:59:59+03:00`,
        },
        searchContext: {
          targetSearchEntitiesContext: {
            targetSearchEntities: [
              {
                type: 'company',
                sparkId: null,
                entityId: null,
                inn: formData.inn,
                maxFullness: formData.fullness,
                inBusinessNews: formData.businessContext,
              },
            ],
            onlyMainRole: formData.mainRole,
            tonality: formData.tone,
            onlyWithRiskFactors: formData.riskFactors,
            riskFactors: { and: [], or: [], not: [] },
            themes: { and: [], or: [], not: [] },
          },
        },
        attributeFilters: {
          excludeTechNews: !formData.marketNews,
          excludeAnnouncements: !formData.announcements,
          excludeDigests: !formData.newsSummaries,
        },
        similarMode: 'duplicates', // Можно выбрать 'none' или 'duplicates'
        limit: parseInt(formData.documentCount),
        intervalType: 'Month',
        histogramTypes: ['totalDocuments', 'riskFactors'],
      };

      console.log('Отправляемый запрос:', requestData);

      // Проверка токена авторизации
      const accessToken = localStorage.getItem('accessToken');
      if (!accessToken) {
        alert('Токен авторизации отсутствует. Пожалуйста, выполните вход.');
        return;
      }

      // Запрос гистограмм
      const histogramsResponse = await fetch('https://gateway.scan-interfax.ru/api/v1/objectsearch/histograms', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify(requestData),
      });

      if (!histogramsResponse.ok) {
        const errorData = await histogramsResponse.json();
        console.error('Ошибка от сервера:', errorData);
        throw new Error(`Ошибка при получении гистограмм: ${errorData.message || 'Неизвестная ошибка'}`);
      }

      const histogramsData = await histogramsResponse.json();

      // Запрос публикаций
      const publicationsResponse = await fetch('https://gateway.scan-interfax.ru/api/v1/objectsearch', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify(requestData),
      });

      if (!publicationsResponse.ok) {
        const errorData = await publicationsResponse.json();
        console.error('Ошибка от сервера:', errorData);
        throw new Error(`Ошибка при получении публикаций: ${errorData.message || 'Неизвестная ошибка'}`);
      }

      const publicationsData = await publicationsResponse.json();

      // Сохраняем данные в localStorage
      localStorage.setItem('histogramsData', JSON.stringify(histogramsData));
      localStorage.setItem('publicationsData', JSON.stringify(publicationsData));

      // Перенаправляем на страницу результатов
      window.location.href = '/result';
    } catch (error) {
      console.error('Произошла ошибка:', error.message);
      alert(`Произошла ошибка: ${error.message}`);
    } finally {
      setIsLoading(false); // Выключаем индикатор загрузки
    }
  };

  return (
    <div>
      {/* Шапка */}
      <Header />

      {/* Основной контент */}
      <main className="search">
        <div className="container">
          <h1 className="search__title">Форма поиска публикаций</h1>

          {/* Форма поиска */}
          <form className="search__form" onSubmit={handleSubmit}>
            {/* ИНН */}
            <div className="search__field">
              <label htmlFor="inn" className="search__label">
                ИНН<span className="required">*</span>
              </label>
              <input
                type="text"
                id="inn"
                name="inn"
                className="search__input"
                placeholder="Введите ИНН"
                value={formData.inn}
                onChange={handleChange}
              />
              {errors.innError && <p className="search__error">{errors.innError}</p>}
            </div>

            {/* Признак максимальной полноты */}
            <div className="search__field">
              <label className="search__checkbox">
                <input
                  type="checkbox"
                  id="fullness"
                  name="fullness"
                  className="search__checkbox-input"
                  checked={formData.fullness}
                  onChange={handleChange}
                />
                <span className="search__checkbox-text">Признак максимальной полноты</span>
              </label>
            </div>

            {/* Упоминания в бизнес-контексте */}
            <div className="search__field">
              <label className="search__checkbox">
                <input
                  type="checkbox"
                  id="businessContext"
                  name="businessContext"
                  className="search__checkbox-input"
                  checked={formData.businessContext}
                  onChange={handleChange}
                />
                <span className="search__checkbox-text">Упоминания в бизнес-контексте</span>
              </label>
            </div>

            {/* Главная роль в публикации */}
            <div className="search__field">
              <label className="search__checkbox">
                <input
                  type="checkbox"
                  id="mainRole"
                  name="mainRole"
                  className="search__checkbox-input"
                  checked={formData.mainRole}
                  onChange={handleChange}
                />
                <span className="search__checkbox-text">Главная роль в публикации</span>
              </label>
            </div>

            {/* Тональность */}
            <div className="search__field">
              <label htmlFor="tone" className="search__label">
                Тональность<span className="required">*</span>
              </label>
              <select
                id="tone"
                name="tone"
                className="search__select"
                value={formData.tone}
                onChange={handleChange}
              >
                <option value="any">Любая</option>
                <option value="positive">Позитивная</option>
                <option value="negative">Негативная</option>
              </select>
            </div>

            {/* Публикации только с риск-факторами */}
            <div className="search__field">
              <label className="search__checkbox">
                <input
                  type="checkbox"
                  id="riskFactors"
                  name="riskFactors"
                  className="search__checkbox-input"
                  checked={formData.riskFactors}
                  onChange={handleChange}
                />
                <span className="search__checkbox-text">Публикации только с риск-факторами</span>
              </label>
            </div>

            {/* Включать технические новости рынков */}
            <div className="search__field">
              <label className="search__checkbox">
                <input
                  type="checkbox"
                  id="marketNews"
                  name="marketNews"
                  className="search__checkbox-input"
                  checked={formData.marketNews}
                  onChange={handleChange}
                />
                <span className="search__checkbox-text">Включать технические новости рынков</span>
              </label>
            </div>

            {/* Включать анонсы и календари */}
            <div className="search__field">
              <label className="search__checkbox">
                <input
                  type="checkbox"
                  id="announcements"
                  name="announcements"
                  className="search__checkbox-input"
                  checked={formData.announcements}
                  onChange={handleChange}
                />
                <span className="search__checkbox-text">Включать анонсы и календари</span>
              </label>
            </div>

            {/* Включать сводки новостей */}
            <div className="search__field">
              <label className="search__checkbox">
                <input
                  type="checkbox"
                  id="newsSummaries"
                  name="newsSummaries"
                  className="search__checkbox-input"
                  checked={formData.newsSummaries}
                  onChange={handleChange}
                />
                <span className="search__checkbox-text">Включать сводки новостей</span>
              </label>
            </div>

            {/* Количество документов в выдаче */}
            <div className="search__field">
              <label htmlFor="documentCount" className="search__label">
                Количество документов в выдаче<span className="required">*</span>
              </label>
              <input
                type="number"
                id="documentCount"
                name="documentCount"
                className="search__input"
                placeholder="От 1 до 1000"
                value={formData.documentCount}
                onChange={handleChange}
              />
            </div>

            {/* Диапазон дат */}
            <div className="search__field">
              <label className="search__label">
                Диапазон дат<span className="required">*</span>
              </label>
              <div className="search__date-range">
                <input
                  type="date"
                  id="startDate"
                  name="startDate"
                  className="search__date"
                  value={formData.startDate}
                  onChange={handleChange}
                />
                <input
                  type="date"
                  id="endDate"
                  name="endDate"
                  className="search__date"
                  value={formData.endDate}
                  onChange={handleChange}
                />
              </div>
              {errors.dateRangeError && <p className="search__error">{errors.dateRangeError}</p>}
            </div>

            {/* Кнопка поиска */}
            <button type="submit" className="search__btn" disabled={isLoading}>
              {isLoading ? 'Загрузка...' : 'Поиск'}
            </button>
          </form>

          {/* Индикатор загрузки */}
          {isLoading && (
            <div className="spinner">
              <div className="spinner__circle"></div>
              <p>Загрузка данных...</p>
            </div>
          )}
        </div>
      </main>

      {/* Подвал */}
      <Footer />
    </div>
  );
};

export default Search;