import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import './css/home.css';

const Home = ({ constitutionData }) => {
  const navigate = useNavigate();
  const [randomArticle, setRandomArticle] = useState(null);

  // Бардык беренелерди бир тизмеге жыйноо (Оптимизация)
  const allArticles = useMemo(() => {
    if (!constitutionData || constitutionData.length === 0) return [];
    return constitutionData.flatMap(section => section.articles || []);
  }, [constitutionData]);

  useEffect(() => {
    // Эгер маалымат бар болсо, дароо бирөөнү тандайт
    if (allArticles.length > 0) {
      const random = allArticles[Math.floor(Math.random() * allArticles.length)];
      setRandomArticle(random);
    }
  }, [allArticles]);

  return (
    <div className="home-container">
      <div className="hero-banner">
        <h1>Викторинага кош келиңиз!</h1>
        <p>Кыргыз Республикасынын мыйзамдарын жана Конституциясын биз менен бирге терең үйрөнүңүз.</p>
      </div>

{/* КҮНДҮН БЕРЕНЕСИ */}
      {randomArticle ? (
        <div 
          className="daily-article-card" 
          onClick={() => navigate(`/constitution?article=${randomArticle.id}`)} // ID жиберүү
          style={{ cursor: 'pointer' }}
        >
          <div className="daily-tag">Күндүн беренеси</div>
          <h3>{randomArticle.title?.ky}</h3>
          <p>{randomArticle.content?.ky?.substring(0, 200)}...</p>
          <span className="read-more">Толук окуу →</span>
        </div>
      ) : (
        <div className="daily-article-card loading-skeleton">
          <p>Маалымат жүктөлүүдө...</p>
        </div>
      )}
      <div className="main-grid">
        <div className="feature-card" onClick={() => navigate('/constitution')}>
          <div className="icon-box">📖</div>
          <h3>Конституция</h3>
          <p>Бардык беренелерди кыргыз жана орус тилдеринде окуңуз.</p>
          <button className="go-btn">Окуу</button>
        </div>

        <div className="feature-card quiz-card" onClick={() => navigate('/normalTests')}>
          <div className="icon-box">📝</div>
          <h3>Тесттен өтүү</h3>
          <p>Өз билимиңизди текшерип, тест тапшырыңыз.</p>
          <button className="go-btn">Баштоо</button>
        </div>

        <div className="feature-card info-card" onClick={() => navigate('/history')}>
          <div className="icon-box">📊</div>
          <h3>Менин жыйынтыктарым</h3>
          <p>Өзүңүздүн жетишкендиктериңизди байкап туруңуз.</p>
          <button className="go-btn">Көрүү</button>
        </div>
      </div>
    </div>
  );
};

export default Home;
