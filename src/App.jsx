import React, { useState, useEffect } from 'react';
import { auth } from './firebase';
import { onAuthStateChanged } from 'firebase/auth';
import AuthForm from './components/AuthForm';
import Header from './components/Header';

// Стилдерди импорттоо
import './components/css/style.css';
import './components/css/menu.css';
import './components/css/tost.css';

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
    // "App" классы стилдерге тоскоол болбошу үчүн аны таза кармайбыз
    <div className="main-wrapper">
      {user ? (
        <>
          <Header user={user} />
          <div className="content-area">
             {/* Бул жерге тесттер же викторинанын мазмуну келет */}
             <h1 style={{color: 'white', textAlign: 'center', marginTop: '100px'}}>
               Виктаринага кош келиңиз!
             </h1>
          </div>
        </>
      ) : (
        <AuthForm />
      )}
    </div>
  );
}

export default App;