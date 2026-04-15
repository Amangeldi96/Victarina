import React, { useState, useEffect } from 'react';
import { auth } from './firebase'; 
import { onAuthStateChanged } from 'firebase/auth';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import AuthForm from './components/AuthForm';
import Header from './components/Header';
import Constitution from './components/constitution'; 
import Home from './components/home';
import Ethics from './components/ethics'; 

// МААЛЫМАТТАР - Бул жердеги аттарды СӨЗСҮЗ текшер!
import { constitutionData } from './data/constitutionData'; 
// Сүрөттө 'ethicsCodeData' деп жазылган, ошол атты колдонобуз
import { ethicsCodeData } from './data/ethicsData'; 

import './components/css/style.css';
import './components/css/menu.css';
import './components/css/tost.css';
import './components/css/constitution.css';

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  if (loading) return <div className="loader">Жүктөлүүдө...</div>;

  return (
    <Router>
      <div className="main-wrapper">
        {user ? (
          <>
            <Header user={user} />
            <div className="content-area">
              <Routes>
                {/* 1. Башкы бет */}
                <Route path="/" element={<Home constitutionData={constitutionData || []} />} />
                
                {/* 2. Конституция */}
                <Route path="/constitution" element={<Constitution data={constitutionData || []} />} />
                
                {/* 3. Этика (ethicsCodeData өзгөрмөсүн жиберебиз) */}
                <Route path="/ethics" element={<Ethics data={ethicsCodeData || []} />} />
                
                {/* 4. Мамлекеттик кызмат */}
                <Route path="/service" element={<div style={{color:'white', padding:'20px'}}>Жакында...</div>} />
              </Routes>
            </div>
          </>
        ) : (
          <AuthForm />
        )}
      </div>
    </Router>
  );
}

export default App;