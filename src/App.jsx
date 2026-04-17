import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { auth } from './firebase';
import { onAuthStateChanged } from 'firebase/auth';

// Компоненттер
import AuthForm from './components/authForm';
import Header from './components/header';
import Home from './components/home';
import Constitution from './components/constitution';
import Ethics from './components/ethics';
import CivilService from './components/civilService';
import History from './components/history';
import Settings from './components/settings';


// Тест компоненттери 
import Test from './components/normalTest';
import LogicTest from './components/logicTest';
import MixedTest from './components/mixedTest';

// Маалыматтар
import { constitutionData } from './data/constitutionData';
import { ethicsCodeData } from './data/ethicsData';
import { civilServiceData } from './data/civilServiceData';
import { normalTestData } from './data/normalTestData';
import { logicTestData } from './data/logicTestData';

// Стилдер
import './components/css/style.css';
import './components/css/menu.css';
import './components/css/test.css';
import './components/css/constitution.css';

// 🔒 Корголгон маршрут компоненти
const ProtectedRoute = ({ user, children }) => {
  return user ? children : <Navigate to="/login" replace />;
};

const mixedTestData = [
  ...(normalTestData || []),
  ...(logicTestData || [])
].map((item, index) => ({
  ...item,
  id: index + 1
}));

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Firebase авторизациясын текшерүү
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // Жүктөлүү учурунда көрсөтүлүүчү экран
  if (loading) {
    return <div className="loader">Жүктөлүүдө...</div>;
  }

  return (
    <Router>
      <div className="main-wrapper">
        {user && <Header user={user} />}

        <div className="content-area">
          <Routes>
            {/* Авторизация */}
            <Route
              path="/login"
              element={!user ? <AuthForm /> : <Navigate to="/" replace />}
            />

            {/* Негизги барактар */}
            <Route
              path="/"
              element={
                <ProtectedRoute user={user}>
                  <Home constitutionData={constitutionData || []} />
                </ProtectedRoute>
              }
            />

            <Route
              path="/constitution"
              element={
                <ProtectedRoute user={user}>
                  <Constitution data={constitutionData || []} />
                </ProtectedRoute>
              }
            />

            <Route
              path="/ethics"
              element={
                <ProtectedRoute user={user}>
                  <Ethics data={ethicsCodeData || []} />
                </ProtectedRoute>
              }
            />

            <Route
              path="/service"
              element={
                <ProtectedRoute user={user}>
                  <CivilService data={civilServiceData || []} />
                </ProtectedRoute>
              }
            />

           {/* 📝 Жалпы тест */}
<Route
  path="/quiz/normal"
  element={
    <ProtectedRoute user={user}>
      <Test
        data={normalTestData || []}
        titleKy="Кадимки тест"   
        titleRu="Обычный тест"   
      />
    </ProtectedRoute>
  }
/>

{/* 🧠 Логикалык тест */}
<Route
  path="/quiz/logic"
  element={
    <ProtectedRoute user={user}>
      <LogicTest
        data={logicTestData || []} 
        titleKy="Логикалык тест" 
        titleRu="Логика и мышление"
      />
    </ProtectedRoute>
  }
/>

{/* 🌀 Аралаш тест (Mixed) */}
<Route
  path="/quiz/mixed"
  element={
    <ProtectedRoute user={user}>
      <MixedTest 
        data={mixedTestData || []} 
        titleKy="Аралаш тест"    // 👈 Бул жерге да titleKy кошуңуз
        titleRu="Смешанный тест"
      />
    </ProtectedRoute>
  }
/>

            {/* Белгисиз маршруттар үчүн */}
            <Route path="*" element={<Navigate to="/" replace />} />
          <Route path="/history" element={<History />} />
        <Route path="/settings" element={<Settings />} />
          </Routes>
          
        </div>
      </div>
    </Router>
  );
}

export default App;
