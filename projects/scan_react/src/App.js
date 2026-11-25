// src/App.js
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './pages/Home';
import Authorization from './pages/Authorization';
import Search from './pages/Search';
import Result from './pages/Result';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <Router>
      <Routes>
        {/* Главная страница */}
        <Route path="/" element={<Home />} />

        {/* Страница авторизации */}
        <Route path="/authorization" element={<Authorization />} />

        {/* Защищенные маршруты */}
        <Route
          path="/search"
          element={
            <ProtectedRoute>
              <Search />
            </ProtectedRoute>
          }
        />
        <Route
          path="/result"
          element={
            <ProtectedRoute>
              <Result />
            </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;