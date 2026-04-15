import React, { useState } from 'react';
import './css/constitution.css';

const Constitution = () => {
  const articles = [
    { id: 1, title: '1-статья', section: 'I БӨЛҮМ', content: 'Кыргыз Республикасы (Кыргызстан) - эгемендүү, демократиялык, укуктук, светтик, унитардык, социалдык мамлекет.' },
    { id: 2, title: '2-статья', section: 'I БӨЛҮМ', content: 'Кыргыз Республикасында эл мамлекеттик бийликтин бирден-бир булагы болуп саналат.' },
    { id: 3, title: '3-статья', section: 'I БӨЛҮМ', content: 'Мамлекеттик бийлик эл тарабынан шайлануучу мамлекеттик органдардын жана жергиликтүү өз алдынча башкаруу органдарынын ишине негизделет.' },
    { id: 4, title: '4-статья', section: 'I БӨЛҮМ', content: 'Кыргыз Республикасында менчиктин жеке, мамлекеттик, муниципалдык жана башка формалары таанылат жана корголот.' },
    { id: 5, title: '5-статья', section: 'I БӨЛҮМ', content: 'Мамлекеттик тил - кыргыз тили. Расмий тил катары орус тили колдонулат.' },
    { id: 16, title: '16-статья', section: 'II БӨЛҮМ', content: 'Кыргыз Республикасында адамдын укуктары жана эркиндиктери жогорку баалуулук болуп саналат.' },
    { id: 17, title: '17-статья', section: 'II БӨЛҮМ', content: 'Мыйзамда белгиленгенден башка учурларда, адамдын укуктарын чектөөгө тыюу салынат.' },
    { id: 18, title: '18-статья', section: 'II БӨЛҮМ', content: 'Ар бир адам өзүнүн укуктук субъектилигинин таанылышына укуктуу.' },
    { id: 19, title: '19-статья', section: 'II БӨЛҮМ', content: 'Кыргыз Республикасында ар бир адам өз өмүрүнө, ден соолугуна, укуктарына жана эркиндиктерине кол салуулардан соттук корголууга укуктуу.' },
  ];

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedArticle, setSelectedArticle] = useState(articles[0]);

  const filteredArticles = articles.filter(art =>
    art.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    art.content.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="constitution-wrapper">
      <div className="article-sidebar">
        <div className="search-box-container">
          <div className="search-wrapper">
            <span className="search-icon">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
            </span>
            <input
              className="search-input"
              type="text"
              placeholder="Издөө..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <div className="article-list">
          {filteredArticles.map((art) => (
            <div
              key={art.id}
              className={`article-item ${selectedArticle.id === art.id ? 'active' : ''}`}
              onClick={() => setSelectedArticle(art)}
            >
              <span className="article-section-label">{art.section}</span>
              <h4 className="article-title-small">{art.title}</h4>
            </div>
          ))}
        </div>
      </div>

      <div className="article-content">
        {selectedArticle && (
          <div className="content-fade">
            <p className="active-section-name">{selectedArticle.section}</p>
            <h1 className="active-title-name">{selectedArticle.title}</h1>
            <div className="accent-line"></div>
            <p className="content-text">{selectedArticle.content}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Constitution;