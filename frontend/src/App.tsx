import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './components/LoginPage';
import HomePage from './components/HomePage';
import GeneratingPage from './components/GeneratingPage';
import MyWorksPage from './components/MyWorksPage';

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  return (
    <Router>
      <Routes>
        <Route 
          path="/login" 
          element={!isLoggedIn ? <LoginPage onLogin={() => setIsLoggedIn(true)} /> : <Navigate to="/" />} 
        />
        <Route 
          path="/" 
          element={isLoggedIn ? <HomePage /> : <Navigate to="/login" />} 
        />
        <Route 
          path="/generating" 
          element={isLoggedIn ? <GeneratingPage /> : <Navigate to="/login" />} 
        />
        <Route 
          path="/my-works" 
          element={isLoggedIn ? <MyWorksPage onLogout={() => setIsLoggedIn(false)} /> : <Navigate to="/login" />} 
        />
      </Routes>
    </Router>
  );
}
