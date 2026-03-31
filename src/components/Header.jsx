import React, { useState } from 'react';
import { signOut } from 'firebase/auth';
import { auth } from '../firebase';

const Header = ({ user }) => {
  const [showProfile, setShowProfile] = useState(false);
  const [isNavActive, setIsNavActive] = useState(false); // Мобилдик меню үчүн

  // Колдонуучунун атын алуу (DisplayName жок болсо, email'дин башын алат)
  const userName = user?.displayName || user?.email?.split('@')[0] || "Колдонуучу";

  const handleLogout = () => {
    if (window.confirm("Системадан чыгууну каалайсызбы?")) {
      signOut(auth);
    }
  };

  return (
    <>
      <header className="main-header">
        <div className="logo">Victarina</div>
        
        {/* Навигация менюсу */}
        <nav className={`nav-menu ${isNavActive ? 'active' : ''}`}>
          <ul>
            <li><a href="/constitution.pdf" target="_blank" rel="noreferrer">Конституция</a></li>
            <li><a href="/civil_service.pdf" target="_blank" rel="noreferrer">Кызмат мыйзамы</a></li>
            <li><a href="/local_government.pdf" target="_blank" rel="noreferrer">Жергиликтүү органдар</a></li>
            <li><a href="/budget_code.pdf" target="_blank" rel="noreferrer">Бюджет кодекси</a></li>
            <li><a href="/accounting_law.pdf" target="_blank" rel="noreferrer">Бухгалтердик эсеп</a></li>
            <li><a href="/gov_decree_120_2020.pdf" target="_blank" rel="noreferrer">Өкмөт токтому №120</a></li>
          </ul>
        </nav>

        <div className="header-right">
          <button id="profile-btn" onClick={() => setShowProfile(true)}>
            👤 {userName}
          </button>
          
          {/* Бургер меню (Мобилдик версия үчүн) */}
          <div className="menu-toggle" onClick={() => setIsNavActive(!isNavActive)}>
            &#9776;
          </div>
        </div>
      </header>

      {/* ПРОФИЛЬ МОДАЛКАСЫ */}
      {showProfile && (
        <div className="profile-modal" onClick={() => setShowProfile(false)}>
          <div className="profile-content" onClick={e => e.stopPropagation()}>
            <div className="avatar-large">👤</div>
            <h2>Салам, {userName}! 👋</h2>
            <p className="user-email">{user?.email}</p>
            <hr />
            <div className="modal-buttons">
              <button id="logout-btn" onClick={handleLogout}>Чыгуу</button>
              <button id="close-profile" onClick={() => setShowProfile(false)}>Жабуу</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Header;