import React, { useState, useEffect } from 'react';
import { signOut } from 'firebase/auth';
import { auth } from '../firebase';
import { Link } from 'react-router-dom';

const Header = ({ user }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [dropdown, setDropdown] = useState(null);
  const [mobileSubMenu, setMobileSubMenu] = useState(null); // ✅ FIX

  const userName = user?.displayName || user?.email?.split('@')[0] || "Колдонуучу";

  useEffect(() => {
    const handleClickOutside = () => {
      setProfileOpen(false);
      setDropdown(null);
    };
    window.addEventListener("click", handleClickOutside);
    return () => window.removeEventListener("click", handleClickOutside);
  }, []);

  const handleLogout = (e) => {
    e.stopPropagation();
    if (window.confirm("Чыгасызбы?")) signOut(auth);
  };

  const toggleMobileSub = (menu) => { // ✅ FIX
    setMobileSubMenu(prev => (prev === menu ? null : menu));
  };

  const Icons = {
    Home: () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>,
    Law: () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 7V3M7 8v10M17 8v10M3 18h18M10 21h4"/></svg>,
    Test: () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 11l3 3L22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/></svg>,
    History: () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 20v-6M9 20v-10M15 20v-2M3 20h18M3 4h18v4H3z"/></svg>,
    Settings: () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>,
    Logout: () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9"/></svg>,
    Chevron: () => ( // ✅ FIX
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <polyline points="6 9 12 15 18 9" />
      </svg>
    )
  };

  const initial = userName?.[0]?.toUpperCase() || "U"; // ✅ SAFE

  return (
    <>
      <header className="main-header" onClick={(e) => e.stopPropagation()}>
        <div className="header-container">

          <div className="header-left">
            <Link to="/" className="header-logo" style={{ textDecoration: 'none', color: 'inherit' }}>
              Тестке Даярдык
            </Link>
          </div>

          <nav className="desktop-nav">
            <ul className="nav-list">
              <li className="nav-item">
                <Link to="/" className="nav-link">Башкы</Link>
              </li>

              <li
                className="nav-item"
                onMouseEnter={() => setDropdown('law')}
                onMouseLeave={() => setDropdown(null)}
              >
                <span className="nav-link">Мыйзамдар <span className="chevron">▾</span></span>
                <div className={`dropdown-panel ${dropdown === 'law' ? 'show' : ''}`}>
                  <Link to="/constitution">Конституция</Link>
                  <Link to="/ethics">Этика кодекси</Link>
                  <Link to="/service">Мамлекеттик кызмат</Link>
                </div>
              </li>

              <li
                className="nav-item"
                onMouseEnter={() => setDropdown('test')}
                onMouseLeave={() => setDropdown(null)}
              >
                <span className="nav-link">Тесттер <span className="chevron">▾</span></span>
                <div className={`dropdown-panel ${dropdown === 'test' ? 'show' : ''}`}>
                  <Link to="/quiz/general">Жалпы тест</Link>
                  <Link to="/quiz/logic">Логика</Link>
                </div>
              </li>
            </ul>
          </nav>

          <div className="header-right">
            <div className="pc-profile-wrapper">
              <button className="user-pill" onClick={(e) => { e.stopPropagation(); setProfileOpen(!profileOpen); }}>
                <span className="user-pill-name">{userName}</span>
                <div className="user-avatar">{initial}</div>
              </button>

              {profileOpen && (
                <div className="profile-dropdown-modal">
                  <div className="p-modal-header">
                    <strong>{userName}</strong>
                    <span>{user?.email}</span>
                  </div>
                  <hr />
                  <Link to="/history" className="p-modal-item"><Icons.History /> Менин тарыхым</Link>
                  <Link to="/settings" className="p-modal-item"><Icons.Settings /> Настройка</Link>
                  <hr />
                  <button className="p-modal-item logout" onClick={handleLogout}>
                    <Icons.Logout /> Чыгуу
                  </button>
                </div>
              )}
            </div>

            <button className="mobile-burger-btn" onClick={() => setMobileMenuOpen(true)}>
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5">
                <line x1="3" y1="6" x2="21" y2="6" />
                <line x1="3" y1="12" x2="21" y2="12" />
                <line x1="3" y1="18" x2="21" y2="18" />
              </svg>
            </button>
          </div>
        </div>
      </header>

      {/* --- МОБИЛДИК СИДЕБАР --- */}
      <div className={`mobile-sidebar ${mobileMenuOpen ? 'active' : ''}`}>

        <div className="sidebar-header">
          <div className="user-info-card">
            <div className="user-avatar-lg">{initial}</div>
            <div className="user-text">
              <h4>{userName}</h4>
              <p>{user?.email}</p>
            </div>
          </div>
          <button className="close-sidebar" onClick={() => setMobileMenuOpen(false)}>✕</button>
        </div>

        <div className="sidebar-body">
          <div className="sidebar-section">

            <label>Меню</label>

            <Link to="/" className="sidebar-link" onClick={() => setMobileMenuOpen(false)}>
              <Icons.Home /> Башкы бет
            </Link>

            {/* Мыйзамдар */}
            <div className={`mobile-collapsible ${mobileSubMenu === 'law' ? 'open' : ''}`}>
              <button className="sidebar-link" onClick={() => toggleMobileSub('law')}>
                <div className="link-content"><Icons.Law /> Мыйзамдар</div>
                <Icons.Chevron />
              </button>

              <div className="mobile-sub-links">
                <Link to="/constitution" onClick={() => setMobileMenuOpen(false)}>Конституция</Link>
                <Link to="/ethics" onClick={() => setMobileMenuOpen(false)}>Этика кодекси</Link>
                <Link to="/service" onClick={() => setMobileMenuOpen(false)}>Мамлекеттик кызмат</Link>
              </div>
            </div>

            {/* Тесттер */}
            <div className={`mobile-collapsible ${mobileSubMenu === 'test' ? 'open' : ''}`}>
              <button className="sidebar-link" onClick={() => toggleMobileSub('test')}>
                <div className="link-content"><Icons.Test /> Тесттер</div>
                <Icons.Chevron />
              </button>

              <div className="mobile-sub-links">
                <Link to="/quiz/general" onClick={() => setMobileMenuOpen(false)}>Жалпы тест</Link>
                <Link to="/quiz/logic" onClick={() => setMobileMenuOpen(false)}>Логика</Link>
              </div>
            </div>

          </div>

          <div className="sidebar-section">
            <label>Профиль</label>

            <Link to="/history" className="sidebar-link" onClick={() => setMobileMenuOpen(false)}>
              <Icons.History /> Менин тарыхым
            </Link>

            <Link to="/settings" className="sidebar-link" onClick={() => setMobileMenuOpen(false)}>
              <Icons.Settings /> Настройка
            </Link>

            <button className="sidebar-link logout-btn" onClick={handleLogout}>
              <Icons.Logout /> Чыгуу
            </button>
          </div>
        </div>
      </div>

      {mobileMenuOpen && <div className="sidebar-overlay" onClick={() => setMobileMenuOpen(false)}></div>}
    </>
  );
};

export default Header;