import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Login from './components/Login';
import Signup from './components/Signup';
import EmployeeList from './components/EmployeeList';
import EmployeeRegistration from './components/EmployeeRegistration';
import AIRecommendation from './components/AIRecommendation';

const App = () => {
  const [token, setToken] = useState(localStorage.getItem('token'));

  return (
    <Router>
      <div className="app-container">
        <Navbar token={token} setToken={setToken} />
        <Routes>
          <Route path="/login" element={!token ? <Login setToken={setToken} /> : <Navigate to="/" />} />
          <Route path="/signup" element={!token ? <Signup setToken={setToken} /> : <Navigate to="/" />} />
          
          <Route path="/" element={token ? <EmployeeList /> : <Navigate to="/login" />} />
          <Route path="/add-employee" element={token ? <EmployeeRegistration /> : <Navigate to="/login" />} />
          <Route path="/ai-recommendations" element={token ? <AIRecommendation /> : <Navigate to="/login" />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
