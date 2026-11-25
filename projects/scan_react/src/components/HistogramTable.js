// src/components/HistogramTable.js
import React from 'react';

const HistogramTable = ({ histogramsData }) => {
  // Проверяем наличие данных
  if (
    !histogramsData ||
    !Array.isArray(histogramsData.data) ||
    histogramsData.data.length === 0
  ) {
    console.error('Ошибка: Данные гистограмм отсутствуют или имеют неверный формат.');
    return <p>Ошибка: Недостаточно данных для построения таблицы.</p>;
  }

  // Находим данные для totalDocuments и riskFactors
  const totalDocuments = histogramsData.data.find(
    (item) => item.histogramType === 'totalDocuments'
  );
  const riskFactors = histogramsData.data.find(
    (item) => item.histogramType === 'riskFactors'
  );

  // Проверяем, что данные существуют и имеют корректный формат
  if (
    !totalDocuments ||
    !riskFactors ||
    !Array.isArray(totalDocuments.data) ||
    !Array.isArray(riskFactors.data) ||
    totalDocuments.data.length === 0 ||
    riskFactors.data.length === 0
  ) {
    console.error('Ошибка: Недостаточно данных для построения таблицы.');
    return <p>Ошибка: Недостаточно данных для построения таблицы.</p>;
  }

  // Проверяем, что все элементы в данных имеют необходимые поля
  const validateData = (data) =>
    data.every((item) => item.date && typeof item.value === 'number');

  if (!validateData(totalDocuments.data) || !validateData(riskFactors.data)) {
    console.error('Ошибка: Некорректные данные в гистограммах.');
    return <p>Ошибка: Некорректные данные в гистограммах.</p>;
  }

  return (
    <table className="histogram-table">
      <thead>
        <tr>
          <th>Период</th>
          {totalDocuments.data.map((item, index) => (
            <th key={index}>{new Date(item.date).toLocaleDateString('ru-RU')}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>Всего документов</td>
          {totalDocuments.data.map((item, index) => (
            <td key={index}>{item.value}</td>
          ))}
        </tr>
        <tr>
          <td>Риски</td>
          {riskFactors.data.map((item, index) => (
            <td key={index}>{item.value}</td>
          ))}
        </tr>
      </tbody>
    </table>
  );
};

export default HistogramTable;