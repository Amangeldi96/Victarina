import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { auth } from './firebase';
import { onAuthStateChanged } from 'firebase/auth';

// Компоненттер
import AuthForm from './components/AuthForm';
import Header from './components/Header';
import Home from './components/home';
import Constitution from './components/constitution';
import Ethics from './components/ethics';
import CivilService from './components/civilService';

// Тест компоненттери 
import Test from './components/normalTest';
import LogicTest from './components/logicTest';
import MixedTest from './components/mixedTest';

// Маалыматтар
import { constitutionData } from './data/constitutionData';
import { ethicsCodeData } from './data/ethicsData';
import { civilServiceData } from './data/civilServiceData';
import { generalTestData } from './data/normalTestData';
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
  ...(generalTestData || []),
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
                    data={generalTestData || []}
                    title="Жалпы тест"
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
        // Маалыматтардын бош эмес экенин текшеребиз
        data={logicTestData && logicTestData.length > 0 ? logicTestData : []} 
        titleKy="Логикалык тест"
        titleRu="Логика и мышление"
      />
    </ProtectedRoute>
  }
/>

               {/* 🌀 MIXED */}
           <Route
  path="/quiz/mixed"
  element={
    <ProtectedRoute user={user}>
      <MixedTest data={mixedTestData} />
    </ProtectedRoute>
  }
/>

            {/* Белгисиз маршруттар үчүн */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;