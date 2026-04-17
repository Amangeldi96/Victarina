import React, { useState, useEffect } from 'react';
import { signOut } from 'firebase/auth';
import { auth } from '../firebase';
import { Link, useLocation } from 'react-router-dom';
import { 
  CheckCircle, XCircle, X, LogOut, Settings as SettingsIcon, 
  History as HistoryIcon, Home, Scale, ChevronDown, BookOpen 
} from 'lucide-react';

const Header = ({ user }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [dropdown, setDropdown] = useState(null);
  
  // Мобилдик ички менюларды өз-өзүнчө башкаруу
  const [mobileSubMenu, setMobileSubMenu] = useState({ law: false, test: false });
  
  const [toast, setToast] = useState({ show: false, type: '', text: '' });
  const [modal, setModal] = useState({ show: false });

  const location = useLocation();

  const userName = user?.displayName || user?.email?.split('@')[0] || "Колдонуучу";
  const initial = userName.trim().charAt(0).toUpperCase() || "U";

  // Меню ачылганда экрандын скроллун токтотуу
  useEffect(() => {
    document.body.style.overflow = mobileMenuOpen ? 'hidden' : 'auto';
  }, [mobileMenuOpen]);

  useEffect(() => {
    const handleClickOutside = () => {
      setProfileOpen(false);
      setDropdown(null);
    };
    window.addEventListener("click", handleClickOutside);
    return () => window.removeEventListener("click", handleClickOutside);
  }, []);

  const showToast = (type, text) => {
    setToast({ show: true, type, text });
    setTimeout(() => setToast({ show: false, type: '', text: '' }), 3000);
  };

  const handleLogoutClick = (e) => {
    e.stopPropagation();
    setModal({ show: true });
    setProfileOpen(false);
    setMobileMenuOpen(false);
  };

  const executeLogout = async () => {
    try {
      await signOut(auth);
      showToast('success', 'Ийгиликтүү чыктыңыз!');
    } catch (error) {
      showToast('error', 'Чыгууда ката кетти.');
    } finally {
      setModal({ show: false });
    }
  };

  const toggleMobileSub = (menu) => {
    setMobileSubMenu(prev => ({ ...prev, [menu]: !prev[menu] }));
  };

  return (
    <>
      {/* --- TOAST --- */}
      <div className={`toast-container ${toast.show ? 'show' : ''}`}>
        <div className={`toast-box ${toast.type}`}>
          {toast.type === 'success' ? <CheckCircle size={20} /> : <XCircle size={20} />}
          <span>{toast.text}</span>
        </div>
      </div>

      {/* --- MODAL --- */}
      {modal.show && (
        <div className="modal-overlay" onClick={() => setModal({ show: false })}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Чыгуу</h3>
              <X size={20} onClick={() => setModal({ show: false })} style={{cursor:'pointer'}} />
            </div>
            <p>Аккаунттан чыккыңыз келеби?</p>
            <div className="modal-actions">
              <button className="btn-cancel" onClick={() => setModal({ show: false })}>Жок</button>
              <button className="btn-confirm" onClick={executeLogout}>Ооба</button>
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
                  <Link to="/quiz/normal">Кадимки</Link>
                  <Link to="/quiz/logic">Логика</Link>
                  <Link to="/quiz/mixed">Аралаш</Link>
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
                    <span style={{fontSize: '12px', color: '#64748b'}}>{user?.email}</span>
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
          <button className="close-sidebar" onClick={() => setMobileMenuOpen(false)}><X size={24}/></button>
        </div>

        <div className="sidebar-body">
          <div className="sidebar-section">
            <label>Негизги меню</label>
            <Link to="/" className="sidebar-link" onClick={() => setMobileMenuOpen(false)}>
              <div className="link-content"><Home size={20} /> Башкы бет</div>
            </Link>

            {/* МЫЙЗАМДАР */}
            <div className={`mobile-collapsible ${mobileSubMenu.law ? 'open' : ''}`}>
              <button className="sidebar-link" onClick={() => toggleMobileSub('law')}>
                <div className="link-content"><Scale size={20} /> Мыйзамдар</div>
                <ChevronDown size={18} className="chev-icon" />
              </button>
              <div className="mobile-sub-links">
                <Link to="/constitution" onClick={() => setMobileMenuOpen(false)}>Конституция</Link>
                <Link to="/ethics" onClick={() => setMobileMenuOpen(false)}>Этика кодекси</Link>
                <Link to="/service" onClick={() => setMobileMenuOpen(false)}>Мамлекеттик кызмат</Link>
              </div>
            </div>

            {/* ТЕСТТЕР */}
            <div className={`mobile-collapsible ${mobileSubMenu.test ? 'open' : ''}`}>
              <button className="sidebar-link" onClick={() => toggleMobileSub('test')}>
                <div className="link-content"><BookOpen size={20} /> Тесттер</div>
                <ChevronDown size={18} className="chev-icon" />
              </button>
              <div className="mobile-sub-links">
                <Link to="/quiz/normal" onClick={() => setMobileMenuOpen(false)}>Кадимки тест</Link>
                <Link to="/quiz/logic" onClick={() => setMobileMenuOpen(false)}>Логикалык тест</Link>
                <Link to="/quiz/mixed" onClick={() => setMobileMenuOpen(false)}>Аралаш тест</Link>
              </div>
            </div>
          </div>

          <div className="sidebar-section">
            <label>Профиль</label>
            <Link to="/history" className="sidebar-link" onClick={() => setMobileMenuOpen(false)}>
              <div className="link-content"><HistoryIcon size={20} /> Менин тарыхым</div>
            </Link>
            <Link to="/settings" className="sidebar-link" onClick={() => setMobileMenuOpen(false)}>
              <div className="link-content"><SettingsIcon size={20} /> Настройка</div>
            </Link>
            <button className="sidebar-link logout-btn" onClick={handleLogoutClick}>
              <div className="link-content"><LogOut size={20} /> Чыгуу</div>
            </button>
          </div>
        </div>
      </div>
      
      {mobileMenuOpen && <div className="sidebar-overlay" onClick={() => setMobileMenuOpen(false)}></div>}

      <style>{`
        .main-header { background: #6366f1; height: 70px; display: flex; align-items: center; position: sticky; top: 0; z-index: 1000; }
        .header-container { width: 95%; max-width: 1200px; margin: 0 auto; display: flex; justify-content: space-between; align-items: center; }
        .header-logo { color: white; text-decoration: none; font-weight: bold; font-size: 1.2rem; }
        
        .desktop-nav .nav-list { display: flex; list-style: none; gap: 20px; }
        .nav-link { color: white; cursor: pointer; display: flex; align-items: center; gap: 5px; }

        .mobile-sidebar { 
          position: fixed; top: 0; right: -100%; width: 290px; height: 100vh; 
          background: white; z-index: 30000; transition: 0.3s ease; 
          display: flex; flex-direction: column; box-shadow: -5px 0 15px rgba(0,0,0,0.1);
        }
        .mobile-sidebar.active { right: 0; }
        .sidebar-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.5); z-index: 25000; backdrop-filter: blur(2px); }

        .sidebar-header { padding: 25px 20px; background: #f8fafc; border-bottom: 1px solid #e2e8f0; display: flex; justify-content: space-between; align-items: center; }
        .user-avatar-lg { width: 50px; height: 50px; background: #6366f1; color: white; border-radius: 12px; display: flex; align-items: center; justify-content: center; font-size: 20px; font-weight: bold; }
        .user-text h4 { margin: 0; font-size: 16px; color: #1e293b; }
        .user-text p { margin: 0; font-size: 12px; color: #64748b; }
        .close-sidebar { background: none; border: none; cursor: pointer; color: #64748b; }

        .sidebar-body { padding: 20px; overflow-y: auto; }
        .sidebar-section label { display: block; font-size: 11px; text-transform: uppercase; color: #94a3b8; font-weight: 700; margin-bottom: 10px; margin-top: 15px; }
        
        .sidebar-link { 
          display: flex; align-items: center; justify-content: space-between; width: 100%; 
          padding: 12px 10px; color: #334155; text-decoration: none; border-radius: 10px; 
          background: none; border: none; font-size: 15px; cursor: pointer;
        }
        .link-content { display: flex; align-items: center; gap: 12px; }
        .chev-icon { transition: 0.3s; }

        .mobile-sub-links { max-height: 0; overflow: hidden; transition: 0.3s; padding-left: 45px; }
        .mobile-collapsible.open .mobile-sub-links { max-height: 200px; padding-bottom: 10px; }
        .mobile-collapsible.open .chev-icon { transform: rotate(180deg); }
        .mobile-sub-links a { display: block; padding: 10px 0; color: #64748b; text-decoration: none; font-size: 14px; border-bottom: 1px solid #f1f5f9; }

        .logout-btn { color: #ef4444 !important; }

        @media (min-width: 769px) { .mobile-burger-btn { display: none; } }
        @media (max-width: 768px) { .desktop-nav, .pc-profile-wrapper { display: none; } }
      `}</style>
    </>
  );
};

export default Header;
    
