import React, { useEffect, useState } from 'react';
import { db, auth } from '../firebase';
import { collection, query, where, getDocs, orderBy } from 'firebase/firestore';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell,
  PieChart, Pie
} from 'recharts';

const History = () => {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const user = auth.currentUser;

  useEffect(() => {
    const fetchHistory = async () => {
      if (!user) return;
      try {
        const q = query(
          collection(db, "test_history"),
          where("userId", "==", user.uid),
          orderBy("createdAt", "desc")
        );
        const querySnapshot = await getDocs(q);
        const data = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
          // Датаны окула тургандай кылуу
          date: doc.data().createdAt?.toDate().toLocaleDateString('ky-KG') || ''
        }));
        setHistory(data);
      } catch (e) {
        console.error("Error fetching history: ", e);
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, [user]);

  if (loading) return <div className="loader">Жүктөлүүдө...</div>;

  // Диаграмма үчүн акыркы 5 тесттин маалыматы
  const chartData = [...history].reverse().slice(-7);

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

  return (
    <div className="history-container" style={{ padding: '20px', maxWidth: '1000px', margin: '0 auto' }}>
      <h2 style={{ marginBottom: '20px', textAlign: 'center' }}>Менин жетишкендиктерим</h2>

      {history.length > 0 ? (
        <>
          {/* --- ДИАГРАММА БӨЛҮМҮ --- */}
          <div className="chart-section" style={{ 
            background: '#fff', 
            padding: '20px', 
            borderRadius: '15px', 
            boxShadow: '0 4px 15px rgba(0,0,0,0.05)',
            marginBottom: '30px'
          }}>
            <h3 style={{ fontSize: '16px', marginBottom: '20px', color: '#666' }}>Акыркы тесттердин жыйынтыгы (%)</h3>
            <div style={{ width: '100%', height: 300 }}>
              <ResponsiveContainer>
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="date" />
                  <YAxis unit="%" domain={[0, 100]} />
                  <Tooltip />
                  <Bar dataKey="percentage" radius={[5, 5, 0, 0]}>
                    {chartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* --- ТИЗМЕ БӨЛҮМҮ --- */}
          <div className="history-list">
            <h3 style={{ marginBottom: '15px' }}>Бардык жыйынтыктар</h3>
            {history.map((item) => (
              <div key={item.id} className="history-card" style={{
                background: '#fff',
                padding: '15px 20px',
                borderRadius: '12px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '10px',
                borderLeft: `5px solid ${item.percentage > 70 ? '#4caf50' : '#ff9800'}`
              }}>
                <div>
                  <h4 style={{ margin: 0 }}>{item.testTitle}</h4>
                  <small style={{ color: '#888' }}>{item.date}</small>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '18px', fontWeight: 'bold', color: '#333' }}>
                    {item.correct} / {item.total}
                  </div>
                  <div style={{ fontSize: '12px', color: item.percentage > 50 ? 'green' : 'red' }}>
                    {item.percentage}% ийгиликтүү
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      ) : (
        <div style={{ textAlign: 'center', marginTop: '50px' }}>
          <p>Сиз чыга элексиз. Биринчи тестти тапшырып көрүңүз!</p>
        </div>
      )}
    </div>
  );
};

export default History;