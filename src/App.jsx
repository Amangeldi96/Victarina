import React, { useState, useEffect } from 'react';
import { auth } from './firebase'; // firebase.js App.jsx менен бир жерде болсо
import { onAuthStateChanged } from 'firebase/auth';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Компоненттерди импорттоо (Баш тамга менен жазылышы шарт)
import AuthForm from './components/AuthForm';
import Header from './components/Header';
import Constitution from './components/constitution'; 

// Стилдердин жолу (Relative paths)
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

  if (loading) {
    return (
      <div className="loader-container">
        <div className="loader">Жүктөлүүдө...</div>
      </div>
    );
  }

  return (
    <Router>
      <div className="main-wrapper">
        {user ? (
          <>
            <Header user={user} />
            <div className="content-area">
              <Routes>
                {/* Башкы бет */}
                <Route path="/" element={
                  <h1 style={{ color: 'white', textAlign: 'center', marginTop: '100px' }}>
                    Викторинага кош келиңиз!
                  </h1>
                } />

                {/* Конституция барагы */}
                <Route path="/constitution" element={<Constitution />} />

                {/* Башка беттер */}
                <Route path="/ethics" element={<div style={{color:'white', padding:'20px'}}>Этика кодекси жакында кошулат...</div>} />
                <Route path="/service" element={<div style={{color:'white', padding:'20px'}}>Мамлекеттик кызмат мыйзамы жакында кошулат...</div>} />
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