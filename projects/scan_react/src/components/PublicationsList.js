// src/components/PublicationsList.js
import React from 'react';

const PublicationsList = ({ publicationsData }) => {
  if (!publicationsData || !Array.isArray(publicationsData.items)) {
    console.error('Ошибка: Данные публикаций отсутствуют или имеют неверный формат.');
    return null;
  }

  return (
    <div>
      <h2>Публикации</h2>
      <ul>
        {publicationsData.items.map((item, index) => (
          <li key={index}>
            <p>{item.title || 'Без заголовка'}</p>
            <p>{new Date(item.issueDate).toLocaleDateString()}</p>
            <p>{item.source?.name || 'Источник не указан'}</p>
            <p>{item.content?.markup || 'Текст отсутствует'}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default PublicationsList;