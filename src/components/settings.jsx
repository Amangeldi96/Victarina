import React, { useState, useEffect } from 'react';
import { auth, db } from '../firebase';
import { updateProfile, updatePassword, deleteUser } from 'firebase/auth';
import { collection, query, where, getDocs, deleteDoc, doc } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';
import { User, Lock, Trash2, History, ChevronRight, AlertTriangle, CheckCircle, XCircle, X } from 'lucide-react';

const Settings = () => {
  const user = auth.currentUser;
  const navigate = useNavigate();

  const [name, setName] = useState(user?.displayName || "");
  const [newPass, setNewPass] = useState("");
  const [loading, setLoading] = useState(false);
  
  // Toast абалы
  const [toast, setToast] = useState({ show: false, type: '', text: '' });
  
  // Модалдык терезе абалы
  const [modal, setModal] = useState({ show: false, title: '', text: '', onConfirm: null });

  // --- Билдирүү (Toast) функциясы ---
  const showToast = (type, text) => {
    setToast({ show: true, type, text });
    setTimeout(() => setToast({ ...toast, show: false }), 4000);
  };

  // --- Ырастоо (Modal) чакыруу ---
  const askConfirmation = (title, text, confirmAction) => {
    setModal({ show: true, title, text, onConfirm: confirmAction });
  };

  const closeModal = () => setModal({ ...modal, show: false });

  // --- ФУНКЦИЯЛАР ---
  const handleUpdateName = async () => {
    if (!name.trim()) return;
    setLoading(true);
    try {
      await updateProfile(user, { displayName: name });
      showToast('success', 'Атыңыз ийгиликтүү жаңыртылды!');
    } catch (err) {
      showToast('error', 'Ката кетти: ' + err.message);
    }
    setLoading(false);
  };

  const handleUpdatePassword = async () => {
    if (newPass.length < 6) return showToast('error', 'Пароль 6 символдон аз болбосун!');
    setLoading(true);
    try {
      await updatePassword(user, newPass);
      showToast('success', 'Пароль жаңыланды!');
      setNewPass("");
    } catch (err) {
      showToast('error', 'Кайрадан кирип (Login) анан аракет кылыңыз.');
    }
    setLoading(false);
  };

  const confirmClearHistory = () => {
    askConfirmation(
      "Тарыхты тазалоо", 
      "Бардык тесттердин жыйынтыктары биротоло өчүрүлөт. Макулсузбу?", 
      executeClearHistory
    );
  };

  const executeClearHistory = async () => {
    setLoading(true);
    closeModal();
    try {
      const q = query(collection(db, "test_history"), where("userId", "==", user.uid));
      const snapshot = await getDocs(q);
      const deletePromises = snapshot.docs.map(d => deleteDoc(doc(db, "test_history", d.id)));
      await Promise.all(deletePromises);
      showToast('success', 'Тарых ийгиликтүү тазаланды!');
    } catch (err) {
      showToast('error', 'Тазалоодо ката кетти.');
    }
    setLoading(false);
  };

  const confirmDeleteAccount = () => {
    askConfirmation(
      "Аккаунтту өчүрүү", 
      "Сиздин профилиңиз жана бардык маалыматтарыңыз биротоло жок кылынат. Бул аракетти артка кайтарып болбойт!", 
      executeDeleteAccount
    );
  };

  const executeDeleteAccount = async () => {
    setLoading(true);
    closeModal();
    try {
      await deleteUser(user);
      navigate('/login');
    } catch (err) {
      showToast('error', 'Коопсуздук үчүн кайрадан кирип, анан өчүрүп көрүңүз.');
    }
    setLoading(false);
  };

  return (
    <div style={{ background: '#f8fafc', minHeight: '100vh', padding: '40px 20px', fontFamily: "'Poppins', sans-serif" }}>
      
      {/* --- ТОСТ БИЛДИРҮҮ (TOAST) --- */}
      <div className={`toast-container`}>
        <div className={`toast ${toast.show ? 'show' : ''} ${toast.type}`}>
          {toast.type === 'success' ? <CheckCircle size={20} color="#2ecc71" /> : <XCircle size={20} color="#e74c3c" />}
          <span>{toast.text}</span>
        </div>
      </div>

      {/* --- МОДАЛДЫК ТЕРЕЗЕ (CONFIRMATION) --- */}
      {modal.show && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '15px' }}>
              <h3 style={{ margin: 0, fontSize: '18px', color: '#1e293b' }}>{modal.title}</h3>
              <X size={20} onClick={closeModal} style={{ cursor: 'pointer', color: '#94a3b8' }} />
            </div>
            <p style={{ color: '#64748b', fontSize: '14px', lineHeight: '1.6', marginBottom: '25px' }}>{modal.text}</p>
            <div style={{ display: 'flex', gap: '12px' }}>
              <button onClick={closeModal} className="btn-secondary">Жок</button>
              <button onClick={modal.onConfirm} className="btn-confirm">Ооба, аткаруу</button>
            </div>
          </div>
        </div>
      )}

      <div style={{ maxWidth: '500px', margin: '0 auto' }}>
        <h1 style={{ fontSize: '24px', fontWeight: '800', color: '#1e293b', marginBottom: '30px', textAlign: 'center' }}>Орнотуулар</h1>

        <div style={{ display: 'grid', gap: '16px' }}>
          
          <div style={cardStyle}>
            <div style={headerStyle}><User size={20} color="#6366f1"/> <span>Жеке маалымат</span></div>
            <div style={{ marginTop: '15px' }}>
              <label style={labelStyle}>Аты-жөнүңүз</label>
              <div style={{ display: 'flex', gap: '10px' }}>
                <input style={inputStyle} value={name} onChange={(e) => setName(e.target.value)} placeholder="Атыңызды жазыңыз" />
                <button onClick={handleUpdateName} disabled={loading} style={smallBtnStyle('#6366f1')}>Сактоо</button>
              </div>
            </div>
          </div>

          <div style={cardStyle}>
            <div style={headerStyle}><Lock size={20} color="#10b981"/> <span>Коопсуздук</span></div>
            <div style={{ marginTop: '15px' }}>
              <label style={labelStyle}>Жаңы пароль</label>
              <div style={{ display: 'flex', gap: '10px' }}>
                <input style={inputStyle} type="password" value={newPass} onChange={(e) => setNewPass(e.target.value)} placeholder="******" />
                <button onClick={handleUpdatePassword} disabled={loading} style={smallBtnStyle('#10b981')}>Жаңыртуу</button>
              </div>
            </div>
          </div>

          <div style={cardStyle}>
            <div style={headerStyle}><History size={20} color="#f59e0b"/> <span>Маалыматтарды башкаруу</span></div>
            <div style={{ marginTop: '15px' }}>
              <div style={listOptionStyle} onClick={confirmClearHistory}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', color: '#475569' }}>
                  <Trash2 size={18} /> <span>Тесттердин тарыхын тазалоо</span>
                </div>
                <ChevronRight size={18} color="#94a3b8" />
              </div>
            </div>
          </div>

          <div style={{ ...cardStyle, border: '1px solid #fee2e2' }}>
            <div style={headerStyle}><AlertTriangle size={20} color="#ef4444"/> <span style={{color: '#ef4444'}}>Кооптуу зона</span></div>
            <button onClick={confirmDeleteAccount} style={btnDangerStyle} disabled={loading}>Аккаунтту биротоло өчүрүү</button>
          </div>

        </div>
      </div>

      {/* --- СТИЛДЕР (CSS-IN-JS) --- */}
      <style>{`
        .toast-container { position: fixed; top: 20px; right: 20px; z-index: 99999; }
        .toast { 
          background: white; color: #333; padding: 15px 25px; border-radius: 12px;
          box-shadow: 0 8px 20px rgba(0, 0, 0, 0.15); margin-bottom: 10px;
          display: flex; align-items: center; gap: 12px; font-weight: 500;
          transform: translateX(150%); transition: transform 0.4s cubic-bezier(0.68, -0.55, 0.265, 1.55);
          border-left: 5px solid #5995fd;
        }
        .toast.show { transform: translateX(0); }
        .toast.success { border-left-color: #2ecc71; }
        .toast.error { border-left-color: #e74c3c; }

        .modal-overlay {
          position: fixed; top: 0; left: 0; width: 100%; height: 100%;
          background: rgba(15, 23, 42, 0.6); backdrop-filter: blur(4px);
          display: flex; align-items: center; justify-content: center; z-index: 100000;
          animation: fadeIn 0.2s ease;
        }
        .modal-content {
          background: white; padding: 30px; border-radius: 24px; width: 90%; max-width: 400px;
          box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1); animation: slideUp 0.3s ease;
        }
        .btn-secondary {
          flex: 1; padding: 12px; border-radius: 12px; border: 1px solid #e2e8f0;
          background: #f8fafc; color: #64748b; font-weight: 600; cursor: pointer;
        }
        .btn-confirm {
          flex: 1; padding: 12px; border-radius: 12px; border: none;
          background: #ef4444; color: white; font-weight: 600; cursor: pointer;
        }

        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes slideUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
      `}</style>
    </div>
  );
};

// --- Жөнөкөй Стилдер ---
const cardStyle = { background: '#fff', padding: '20px', borderRadius: '20px', boxShadow: '0 2px 8px rgba(0,0,0,0.02)', border: '1px solid #f1f5f9' };
const headerStyle = { display: 'flex', alignItems: 'center', gap: '12px', fontSize: '16px', fontWeight: '700', color: '#1e293b' };
const labelStyle = { display: 'block', fontSize: '12px', color: '#94a3b8', marginBottom: '6px', marginLeft: '2px', fontWeight: '600' };
const inputStyle = { flex: 1, padding: '10px 14px', borderRadius: '12px', border: '1.5px solid #e2e8f0', outline: 'none', fontSize: '14px' };
const smallBtnStyle = (bg) => ({ background: bg, color: '#fff', border: 'none', padding: '0 16px', borderRadius: '12px', fontSize: '13px', fontWeight: '600', cursor: 'pointer' });
const listOptionStyle = { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 0', cursor: 'pointer' };
const btnDangerStyle = { width: '100%', padding: '12px', background: '#fff', color: '#ef4444', border: '1.5px solid #fee2e2', borderRadius: '12px', fontWeight: '700', fontSize: '14px', cursor: 'pointer', marginTop: '15px' };

export default Settings;