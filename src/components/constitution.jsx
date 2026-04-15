import React, { useState, useEffect } from 'react';
import './css/constitution.css';

// 'data' бул App.jsx ичинен жиберилген constitutionData
const Constitution = ({ data }) => {
  const [lang, setLang] = useState('ky'); 
  const [searchTerm, setSearchTerm] = useState('');
  const [openSection, setOpenSection] = useState(null);
  const [selectedArticle, setSelectedArticle] = useState(null);

  // 1. Издөө жана чыпкалоо логикасы
  // 'data' бош болсо, ката бербеши үчүн (data || []) колдондук
  const filteredSections = (data || []).map(section => {
    const matched = (section.articles || []).filter(art => {
      const titleText = art.title?.[lang] || "";
      const contentText = art.content?.[lang] || "";
      return (
        titleText.toLowerCase().includes(searchTerm.toLowerCase()) ||
        contentText.toLowerCase().includes(searchTerm.toLowerCase())
      );
    });
    return { ...section, articles: matched };
  }).filter(section => section.articles.length > 0);

  // 2. Биринчи жолу ачылганда биринчи статьяны тандап алуу
  useEffect(() => {
    if (!selectedArticle && data && data.length > 0) {
      if (data[0].articles && data[0].articles.length > 0) {
        setSelectedArticle(data[0].articles[0]);
      }
    }
  }, [data, selectedArticle]);

  // Эгер маалымат такыр жок болсо, экран аппак болбошу үчүн эскертүү
  if (!data || data.length === 0) {
    return <div className="loader">Маалымат жүктөлүүдө же табылган жок...</div>;
  }

  return (
    <div className="constitution-wrapper">
      <div className="article-sidebar">
        
        <div className="language-switcher">
          <button 
            className={lang === 'ky' ? 'active-lang' : ''} 
            onClick={() => setLang('ky')}
          >KG</button>
          <button 
            className={lang === 'ru' ? 'active-lang' : ''} 
            onClick={() => setLang('ru')}
          >RU</button>
        </div>

        <div className="search-box-container">
          <input
            className="search-input"
            type="text"
            placeholder={lang === 'ky' ? "Издөө..." : "Поиск..."}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="article-list">
          {filteredSections.map((section, sIndex) => (
            <div key={sIndex} className="accordion-group">
              <div 
                className={`accordion-title ${openSection === sIndex ? 'active' : ''}`}
                onClick={() => setOpenSection(openSection === sIndex ? null : sIndex)}
              >
                <span>{section.title?.[lang]}</span>
                <span className="arrow">{openSection === sIndex ? '−' : '+'}</span>
              </div>
              
              <div className={`accordion-content ${openSection === sIndex ? 'show' : ''}`}>
                {section.articles.map((art) => (
                  <div 
                    key={art.id} 
                    className={`sub-article-item ${selectedArticle?.id === art.id ? 'selected' : ''}`}
                    onClick={() => setSelectedArticle(art)}
                  >
                    {art.title?.[lang]}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="article-content">
        {selectedArticle ? (
          <div className="content-card">
            <h1 className="active-title-name">{selectedArticle.title?.[lang]}</h1>
            <div className="accent-line"></div>
            <p className="content-text" style={{ whiteSpace: 'pre-wrap' }}>
              {selectedArticle.content?.[lang]}
            </p>
          </div>
        ) : (
          <div style={{ textAlign: 'center', marginTop: '50px', color: '#999' }}>
            {lang === 'ky' ? "Маалымат табылган жок..." : "Данные не найдены..."}
          </div>
        )}
      </div>
    </div>
  );
};

export default Constitution;