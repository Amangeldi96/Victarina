import React, { useState, useEffect } from 'react';
import { signOut } from 'firebase/auth';
import { auth } from '../firebase';
import { Link, useLocation } from 'react-router-dom';
import { CheckCircle, XCircle, X, LogOut, Settings as SettingsIcon, History as HistoryIcon, Home, Scale, ClipboardCheck, ChevronDown } from 'lucide-react';

const Header = ({ user }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [dropdown, setDropdown] = useState(null);
  const [mobileSubMenu, setMobileSubMenu] = useState(null);
  
  // Toast жана Modal үчүн абал (state)
  const [toast, setToast] = useState({ show: false, type: '', text: '' });
  const [modal, setModal] = useState({ show: false, onConfirm: null });

  const location = useLocation();

  const userName = user?.displayName || user?.email?.split('@')[0] || "Колдонуучу";
  const initial = userName?.[0]?.toUpperCase() || "U";

  useEffect(() => {
    const handleClickOutside = () => {
      setProfileOpen(false);
      setDropdown(null);
    };
    window.addEventListener("click", handleClickOutside);
    return () => window.removeEventListener("click", handleClickOutside);
  }, []);

  // Toast көрсөтүү функциясы
  const showToast = (type, text) => {
    setToast({ show: true, type, text });
    setTimeout(() => setToast({ show: false, type: '', text: '' }), 3000);
  };

  const handleLogoutClick = (e) => {
    e.stopPropagation();
    setModal({ show: true, onConfirm: executeLogout });
  };

  const executeLogout = () => {
    signOut(auth);
    setModal({ show: false, onConfirm: null });
  };

  const toggleMobileSub = (menu) => {
    setMobileSubMenu(prev => (prev === menu ? null : menu));
  };

  return (
    <>
      {/* --- TOAST БИЛДИРҮҮ --- */}
      <div className={`toast-container ${toast.show ? 'show' : ''}`}>
        <div className={`toast-box ${toast.type}`}>
          {toast.type === 'success' ? <CheckCircle size={20} /> : <XCircle size={20} />}
          <span>{toast.text}</span>
        </div>
      </div>

      {/* --- ЧЫГУУНУ ЫРАСТОО (MODAL) --- */}
      {modal.show && (
        <div className="modal-overlay" onClick={() => setModal({ show: false, onConfirm: null })}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Чыгуу</h3>
              <X size={20} onClick={() => setModal({ show: false, onConfirm: null })} style={{cursor:'pointer'}} />
            </div>
            <p>Чын эле аккаунттан чыккыңыз келеби?</p>
            <div className="modal-actions">
              <button className="btn-cancel" onClick={() => setModal({ show: false, onConfirm: null })}>Жок</button>
              <button className="btn-confirm" onClick={modal.onConfirm}>Ооба, чыгуу</button>
            </div>
          </div>
        </div>
      )}

      <header className="main-header" onClick={(e) => e.stopPropagation()}>
        <div className="header-container">
          
          <div className="header-left">
            <Link to="/" className="header-logo">Тестке Даярдык</Link>
          </div>

          <nav className="desktop-nav">
            <ul className="nav-list">
              <li className="nav-item">
                <Link to="/" className={`nav-link ${location.pathname === '/' ? 'active' : ''}`}>Башкы</Link>
              </li>

              <li className="nav-item dropdown-trigger" 
                  onMouseEnter={() => setDropdown('law')} 
                  onMouseLeave={() => setDropdown(null)}>
                <span className="nav-link">Мыйзамдар <ChevronDown size={14} className="chev" /></span>
                <div className={`dropdown-panel ${dropdown === 'law' ? 'show' : ''}`}>
                  <Link to="/constitution">Конституция</Link>
                  <Link to="/ethics">Этика кодекси</Link>
                  <Link to="/service">Мамлекеттик кызмат</Link>
                </div>
              </li>

              <li className="nav-item dropdown-trigger" 
                  onMouseEnter={() => setDropdown('test')} 
                  onMouseLeave={() => setDropdown(null)}>
                <span className="nav-link">Тесттер <ChevronDown size={14} className="chev" /></span>
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
                <div className="profile-dropdown-modal show">
                  <div className="p-modal-header">
                    <strong>{userName}</strong>
                    <span>{user?.email}</span>
                  </div>
                  <hr />
                  <Link to="/history" className="p-modal-item"><HistoryIcon size={18} /> Менин тарыхым</Link>
                  <Link to="/settings" className="p-modal-item"><SettingsIcon size={18} /> Настройка</Link>
                  <hr />
                  <button className="p-modal-item logout" onClick={handleLogoutClick}>
                    <LogOut size={18} /> Чыгуу
                  </button>
                </div>
              )}
            </div>

            <button className="mobile-burger-btn" onClick={() => setMobileMenuOpen(true)}>
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5">
                <line x1="3" y1="6" x2="21" y2="6" /><line x1="3" y1="12" x2="21" y2="12" /><line x1="3" y1="18" x2="21" y2="18" />
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
              <Home size={20} /> Башкы бет
            </Link>
            <div className={`mobile-collapsible ${mobileSubMenu === 'law' ? 'open' : ''}`}>
              <button className="sidebar-link" onClick={() => toggleMobileSub('law')}>
                <div className="link-content"><Scale size={20} /> Мыйзамдар</div>
                <ChevronDown size={18} />
              </button>
              <div className="mobile-sub-links">
                <Link to="/constitution" onClick={() => setMobileMenuOpen(false)}>Конституция</Link>
                <Link to="/ethics" onClick={() => setMobileMenuOpen(false)}>Этика кодекси</Link>
                <Link to="/service" onClick={() => setMobileMenuOpen(false)}>Мамлекеттик кызмат</Link>
              </div>
            </div>
          </div>
          <div className="sidebar-section">
            <label>Профиль</label>
            <Link to="/history" className="sidebar-link" onClick={() => setMobileMenuOpen(false)}>
              <HistoryIcon size={20} /> Менин тарыхым
            </Link>
            <Link to="/settings" className="sidebar-link" onClick={() => setMobileMenuOpen(false)}>
              <SettingsIcon size={20} /> Настройка
            </Link>
            <button className="sidebar-link logout-btn" onClick={handleLogoutClick}>
              <LogOut size={20} /> Чыгуу
            </button>
          </div>
        </div>
      </div>
      {mobileMenuOpen && <div className="sidebar-overlay" onClick={() => setMobileMenuOpen(false)}></div>}

      <style>{`
        /* ТЕКСТТЕРДИ АК КЫЛУУ */
        .nav-link, .user-pill-name, .header-logo { color: white !important; text-decoration: none; }
        .chev { transition: transform 0.3s; margin-left: 5px; stroke: white; }
        .nav-item:hover .chev { transform: rotate(180deg); }

        /* TOAST STYLE */
        .toast-container {
          position: fixed; top: 20px; right: 20px; z-index: 10000;
          transform: translateX(120%); transition: transform 0.4s cubic-bezier(0.68, -0.55, 0.265, 1.55);
        }
        .toast-container.show { transform: translateX(0); }
        .toast-box {
          background: white; padding: 12px 20px; border-radius: 12px;
          display: flex; align-items: center; gap: 10px; font-weight: 600;
          box-shadow: 0 10px 25px rgba(0,0,0,0.1); border-left: 5px solid #6366f1;
        }
        .toast-box.success { border-left-color: #2ecc71; color: #2ecc71; }
        .toast-box.error { border-left-color: #e74c3c; color: #e74c3c; }

        /* MODAL STYLE */
        .modal-overlay {
          position: fixed; inset: 0; background: rgba(15, 23, 42, 0.7);
          backdrop-filter: blur(4px); display: flex; align-items: center; justify-content: center; z-index: 20000;
        }
        .modal-content {
          background: white; padding: 25px; border-radius: 20px; width: 90%; max-width: 350px;
          animation: slideUp 0.3s ease;
        }
        .modal-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 15px; }
        .modal-header h3 { margin: 0; color: #1e293b; }
        .modal-actions { display: flex; gap: 10px; margin-top: 20px; }
        .btn-cancel { flex: 1; padding: 12px; border: 1px solid #e2e8f0; border-radius: 12px; background: #f8fafc; cursor: pointer; font-weight: 600; }
        .btn-confirm { flex: 1; padding: 12px; background: #ef4444; color: white; border: none; border-radius: 12px; cursor: pointer; font-weight: 600; }

        @keyframes slideUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
      `}</style>
    </>
  );
};

export default Header;