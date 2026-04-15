import React, { useState, useEffect } from 'react';
import { auth } from './firebase'; 
import { onAuthStateChanged } from 'firebase/auth';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import AuthForm from './components/AuthForm';
import Header from './components/Header';
import Constitution from './components/constitution'; 
import Home from './components/home';

import { constitutionData } from './data'; 

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
                <Route path="/" element={<Home constitutionData={constitutionData} />} />
                <Route path="/constitution" element={<Constitution data={constitutionData} />} />
                <Route path="/ethics" element={<div style={{color:'white', padding:'20px'}}>Этика кодекси жакында...</div>} />
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