import React, { useState, useEffect, useMemo } from 'react';
import { db, auth } from '../firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

const LogicTest = ({ data = [], titleKy, titleRu }) => {
  const [lang, setLang] = useState('ky');
  const [isStarted, setIsStarted] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [userAnswers, setUserAnswers] = useState({});
  const [timeLeft, setTimeLeft] = useState(30 * 60);
  const [showResult, setShowResult] = useState(false);

  // 1. Маалыматты форматтоо жана аралаштыруу
  const quizData = useMemo(() => {
    if (!data || data.length === 0) return [];
    
    const formatted = data.map(item => {
      // Логикалык тестте кээде correctAnswer түз текст же тил объектиси болушу мүмкүн
      const getCorrectVal = (lKey) => {
        if (typeof item.correctAnswer === 'object' && item.correctAnswer !== null) {
          return item.correctAnswer[lKey];
        }
        return item.correctAnswer;
      };

      return {
        ...item,
        question_ky: item.question?.ky || item.question,
        question_ru: item.question?.ru || item.question,
        options_ky: item.options?.ky || item.options,
        options_ru: item.options?.ru || item.options,
        correct_ky: getCorrectVal('ky'),
        correct_ru: getCorrectVal('ru')
      };
    });
    return [...formatted].sort(() => 0.5 - Math.random()).slice(0, 30);
  }, [data]);

  // 2. Статистика жана Firebase
  const calculateStats = () => {
    let correct = 0, wrong = 0;
    quizData.forEach((q, idx) => {
      const ans = userAnswers[idx];
      const correctVal = lang === 'ky' ? q.correct_ky : q.correct_ru;
      
      if (ans === correctVal) {
        correct++;
      } else {
        wrong++;
      }
    });

    const timeSpentSeconds = (30 * 60) - timeLeft;
    const mins = Math.floor(timeSpentSeconds / 60);
    const secs = timeSpentSeconds % 60;

    return { 
      correct, 
      wrong, 
      timeTaken: `${mins}:${secs < 10 ? '0' : ''}${secs}`,
      percentage: Math.round((correct / quizData.length) * 100)
    };
  };

  const handleFinish = async () => {
    const stats = calculateStats();
    setShowResult(true);
    
    const user = auth.currentUser;
    if (user) {
      try {
        await addDoc(collection(db, "test_history"), {
          userId: user.uid,
          testTitle: titleKy,
          correct: stats.correct,
          wrong: stats.wrong,
          timeTaken: stats.timeTaken,
          percentage: stats.percentage,
          createdAt: serverTimestamp()
        });
      } catch (e) {
        console.error("Firebase Error:", e);
      }
    }
  };

  // 3. Таймер эффекти
  useEffect(() => {
    let timer;
    if (isStarted && timeLeft > 0 && !showResult) {
      timer = setInterval(() => setTimeLeft(prev => prev - 1), 1000);
    } else if (timeLeft === 0 && !showResult) {
      handleFinish();
    }
    return () => clearInterval(timer);
  }, [isStarted, timeLeft, showResult]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  const t = {
    ky: { 
      start: "Баштоо", next: "Кийинки", prev: "Артка", finish: "Аяктоо", 
      correct: "Туура", wrong: "Ката", time: "Убакыт",
      review: "Каталар", trueAns: "Туура жооп:", restart: "Кайра баштоо", loading: "Жүктөлүүдө..."
    },
    ru: { 
      start: "Начать", next: "Далее", prev: "Назад", finish: "Завершить", 
      correct: "Верно", wrong: "Ошибка", time: "Время",
      review: "Ошибки", trueAns: "Правильный ответ:", restart: "Заново", loading: "Загрузка..."
    }
  }[lang];

  const LangSwitcher = () => (
    <div className="lang-switcher-container">
      <button className={`lang-btn ${lang === 'ky' ? 'active' : ''}`} onClick={() => setLang('ky')}>KG</button>
      <button className={`lang-btn ${lang === 'ru' ? 'active' : ''}`} onClick={() => setLang('ru')}>RU</button>
    </div>
  );

  if (quizData.length === 0) return <div className="quiz-main-container"><div className="loader">{t.loading}</div></div>;

  if (!isStarted) {
    return (
      <div className="quiz-main-container result-centered">
        <div className="quiz-card result-box">
          <LangSwitcher />
          <h1 className="active-title-name" style={{margin: '20px 0'}}>{lang === 'ky' ? titleKy : titleRu}</h1>
          <p className="score-text">30 суроо • 30 мүнөт</p>
          <button className="next-btn active" onClick={() => setIsStarted(true)}>{t.start}</button>
        </div>
      </div>
    );
  }

  if (showResult) {
    const stats = calculateStats();
    return (
      <div className="quiz-main-container">
        <div className="quiz-card result-box review-mode">
          <h1 className="active-title-name">{stats.percentage}%</h1>
          <div className="stat-grid">
            <div className="stat-item correct">{t.correct}: {stats.correct}</div>
            <div className="stat-item wrong">{t.wrong}: {stats.wrong}</div>
            <div className="stat-item time">{t.time}: {stats.timeTaken}</div>
          </div>
          <div className="review-list">
            <h3 className="review-title">{t.review}</h3>
            {quizData.map((q, idx) => {
              const ans = userAnswers[idx];
              const correctVal = lang === 'ky' ? q.correct_ky : q.correct_ru;
              if (ans === correctVal) return null;
              return (
                <div key={idx} className="review-item">
                  <p className="review-question">{idx + 1}. {lang === 'ky' ? q.question_ky : q.question_ru}</p>
                  <p className="correct-ans">{t.trueAns} {correctVal}</p>
                </div>
              );
            })}
          </div>
          <button className="next-btn active restart-btn" onClick={() => window.location.reload()}>{t.restart}</button>
        </div>
      </div>
    );
  }

  const currentQ = quizData[currentQuestion];

  return (
    <div className="quiz-main-container">
      <div className="quiz-card">
        <div className="quiz-header">
          <div className="quiz-header-left" style={{display: 'flex', alignItems: 'center', gap: '15px'}}>
            <span className="quiz-category-tag">{lang === 'ky' ? titleKy : titleRu}</span>
            <div className="timer-badge">
                <span className="timer">⏱ {formatTime(timeLeft)}</span>
            </div>
          </div>
          <LangSwitcher />
        </div>

        <div className="quiz-progress-bar">
          <div className="progress-fill" style={{ width: `${((currentQuestion + 1) / quizData.length) * 100}%` }}></div>
        </div>

        <div className="quiz-counter">{currentQuestion + 1} / {quizData.length}</div>
        <h2 className="question-text">{lang === 'ky' ? currentQ.question_ky : currentQ.question_ru}</h2>

        <div className="options-grid">
          {(lang === 'ky' ? currentQ.options_ky : currentQ.options_ru).map((opt, i) => (
            <div 
              key={i} 
              className={`option-card ${userAnswers[currentQuestion] === opt ? 'selected' : ''}`} 
              onClick={() => setUserAnswers({ ...userAnswers, [currentQuestion]: opt })}
            >
              <div className="check-indicator radio">
                {userAnswers[currentQuestion] === opt && <div className="check-dot" />}
              </div>
              <span className="option-label">{opt}</span>
            </div>
          ))}
        </div>

        <div className="nav-btns" style={{display: 'flex', justifyContent: 'space-between', marginTop: '30px'}}>
          <button className="next-btn prev-btn" disabled={currentQuestion === 0} onClick={() => setCurrentQuestion(prev => prev - 1)} style={{margin: 0, width: '48%', background: '#f1f3f5', color: '#4a4a4a'}}>
            {t.prev}
          </button>
          <button 
            className={`next-btn ${!userAnswers[currentQuestion] ? 'disabled' : 'active'}`}
            style={{margin: 0, width: '48%'}}
            disabled={!userAnswers[currentQuestion]}
            onClick={() => currentQuestion === quizData.length - 1 ? handleFinish() : setCurrentQuestion(prev => prev + 1)}
          >
            {currentQuestion === quizData.length - 1 ? t.finish : t.next}
          </button>
        </div>
      </div>
    </div>
  );
};

export default LogicTest;