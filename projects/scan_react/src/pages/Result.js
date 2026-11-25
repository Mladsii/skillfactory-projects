import React, { useEffect, useState } from 'react';
import DOMPurify from 'dompurify'; // Библиотека для очистки HTML
import Header from '../components/Header';
import Footer from '../components/Footer';

const Result = () => {
  const [publications, setPublications] = useState([]);
  const [histogramsData, setHistogramsData] = useState(null);
  const [offset, setOffset] = useState(0); // Смещение для подгрузки публикаций
  const [isLoading, setIsLoading] = useState(false);

  // Получаем количество документов из localStorage
  const documentCount = parseInt(localStorage.getItem('documentCount'), 10) || 10;

  // Проверка авторизации
  useEffect(() => {
    const isLoggedIn = localStorage.getItem('isLoggedIn');
    if (isLoggedIn !== 'true') {
      alert('Для доступа к этой странице необходимо авторизоваться.');
      window.location.href = '/';
    }
  }, []);

  // Загрузка данных из localStorage
  useEffect(() => {
    const loadInitialData = async () => {
      try {
        const histograms = JSON.parse(localStorage.getItem('histogramsData'));
        const publicationsData = JSON.parse(localStorage.getItem('publicationsData'));

        if (!histograms || !Array.isArray(histograms.data)) {
          throw new Error('Данные гистограмм отсутствуют.');
        }

        if (!publicationsData || !Array.isArray(publicationsData.items)) {
          throw new Error('Данные публикаций отсутствуют.');
        }

        // Устанавливаем данные гистограмм
        setHistogramsData(histograms);

        // Начальная загрузка публикаций (ровно documentCount)
        await loadPublications(publicationsData.items.slice(0, documentCount));
      } catch (error) {
        console.error('Ошибка при загрузке данных:', error.message);
        alert(`Произошла ошибка: ${error.message}`);
        window.location.href = '/search';
      }
    };

    loadInitialData();
  }, [documentCount]);

const loadPublications = async (items) => {
  setIsLoading(true);

  try {
    const accessToken = localStorage.getItem('accessToken');
    const ids = items.map((item) => item.encodedId);

    // Отправляем запрос к API
    const response = await fetch('https://gateway.scan-interfax.ru/api/v1/documents', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify({ ids }),
    });

    if (!response.ok) {
      throw new Error(`Ошибка при загрузке публикаций: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();

    // Логируем данные из API
    console.log('Ответ API:', data);

    // Проверяем формат данных
    if (!Array.isArray(data)) {
      throw new Error('API вернуло некорректные данные.');
    }

    // Фильтруем и преобразуем данные
    const newPublications = data
      .filter((item) => item.ok) // Оставляем только элементы с полем `ok`
      .map((item) => item.ok); // Извлекаем значение поля `ok`

    // Логируем новые публикации
    console.log('Новые публикации:', newPublications);

    // Добавляем только уникальные публикации
    setPublications((prev) => {
      const existingIds = new Set(prev.map((pub) => pub.id)); // Создаем Set из существующих ID
      const uniqueNewPublications = newPublications.filter((pub) => !existingIds.has(pub.id)); // Фильтруем новые публикации
      return [...prev, ...uniqueNewPublications]; // Объединяем старые и новые публикации
    });
  } catch (error) {
    console.error('Ошибка при загрузке публикаций:', error.message);
    alert(`Произошла ошибка при загрузке публикаций: ${error.message}`);
  } finally {
    setIsLoading(false);
  }
};

  // Функция для загрузки дополнительных публикаций
  const handleLoadMore = () => {
    const publicationsData = JSON.parse(localStorage.getItem('publicationsData'));

    // Используем фиксированный лимит для подгрузки
    const limit = 10; // Фиксированный лимит
    const newItems = publicationsData.items.slice(offset, offset + limit);

    if (newItems.length === 0) {
      alert('Больше публикаций нет.');
      return;
    }

    setOffset((prev) => prev + limit);
    loadPublications(newItems);
  };

  // Функция для отображения гистограмм
  const renderHistograms = () => {
    if (!histogramsData || !Array.isArray(histogramsData.data)) {
      return <p>Данные гистограмм отсутствуют.</p>;
    }

    const totalDocuments = histogramsData.data.find((item) => item.histogramType === 'totalDocuments');
    const riskFactors = histogramsData.data.find((item) => item.histogramType === 'riskFactors');

    if (!totalDocuments || !riskFactors) {
      return <p>Недостаточно данных для отображения гистограмм.</p>;
    }

    return (
      <div className="histograms">
        <h2>Общая сводка</h2>
        <p>Найдено {histogramsData.totalCount} вариантов</p>
        <div className="histogram-carousel">
          <button className="carousel__prev" onClick={handlePrev}>❮</button>
          <div className="carousel__wrapper" ref={carouselRef}>
            <table>
              <thead>
                <tr>
                  <th>Период</th>
                  {totalDocuments.data.map((item) => (
                    <th key={item.date}>{new Date(item.date).toLocaleDateString()}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Всего</td>
                  {totalDocuments.data.map((item) => (
                    <td key={item.date}>{item.value}</td>
                  ))}
                </tr>
                <tr>
                  <td>Риски</td>
                  {riskFactors.data.map((item) => (
                    <td key={item.date}>{item.value}</td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>
          <button className="carousel__next" onClick={handleNext}>❯</button>
        </div>
      </div>
    );
  };

  // Логика для карусели
  const carouselRef = React.useRef(null);

  const handlePrev = () => {
    if (carouselRef.current) {
      carouselRef.current.scrollBy({
        left: -300, // Сдвигаем на ширину одной колонки
        behavior: 'smooth',
      });
    }
  };

  const handleNext = () => {
    if (carouselRef.current) {
      carouselRef.current.scrollBy({
        left: 300, // Сдвигаем на ширину одной колонки
        behavior: 'smooth',
      });
    }
  };

  return (
    <div>
      {/* Шапка */}
      <Header />

      {/* Основной контент */}
      <main className="results">
        <div className="container">
          <h1 className="results__title">Результаты поиска</h1>

          {/* Гистограммы */}
          {renderHistograms()}

          {/* Публикации */}
          <div className="results__publications">
            <h2 className="results__subtitle">Публикации</h2>
            <div className="results__list">
              {publications.map((publication, index) => (
                <div key={index} className="publication-item">
                  {/* Шапка карточки */}
                  <div className="publication-item__header">
                    <p className="publication-item__date">
                      {new Date(publication.issueDate).toLocaleDateString()}
                    </p>
                    <a
                      href={publication.source.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="publication-item__source"
                    >
                      {publication.source?.name || 'Источник не указан'}
                    </a>
                  </div>

                  {/* Заголовок */}
                  <h3 className="publication-item__title">{publication.title?.text || 'Без заголовка'}</h3>

                  {/* Теги */}
                  <div className="publication-item__tags">
                    {publication.attributes.isTechNews && <span className="tag tag--tech">Технические новости</span>}
                    {publication.attributes.isAnnouncement && <span className="tag tag--announcement">Анонсы и события</span>}
                    {publication.attributes.isDigest && <span className="tag tag--digest">Сводки новостей</span>}
                  </div>

                  {/* Содержимое */}
                  <p
                    className="publication-item__text"
                    dangerouslySetInnerHTML={{
                      __html: DOMPurify.sanitize(publication.content?.markup || 'Текст отсутствует'),
                    }}
                  ></p>

                  {/* Подвал карточки */}
<div className="publication-item__footer">
  {publication.url ? (
    <a
      href={publication.url}
      target="_blank"
      rel="noopener noreferrer"
      className="publication-item__read-more"
    >
      Читать в источнике
    </a>
  ) : (
    <span className="publication-item__read-more--disabled">
      Ссылка на источник недоступна
    </span>
  )}
  <p className="publication-item__word-count">
    Количество слов: {publication.attributes.wordCount || 'Неизвестно'}
  </p>
</div>
                </div>
              ))}
            </div>

            {/* Кнопка "Показать больше" */}
            <button
              className="results__load-more"
              onClick={handleLoadMore}
              disabled={isLoading}
            >
              {isLoading ? 'Загрузка...' : 'Показать больше'}
            </button>
          </div>
        </div>
      </main>

      {/* Подвал */}
      <Footer />
    </div>
  );
};

export default Result;