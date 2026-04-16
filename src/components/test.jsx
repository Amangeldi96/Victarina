import React, { useState, useEffect, useMemo } from 'react';

const Test = ({ data = [], titleKy, titleRu }) => {
  const [lang, setLang] = useState('ky');
  const [isStarted, setIsStarted] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [userAnswers, setUserAnswers] = useState({});
  const [timeLeft, setTimeLeft] = useState(30 * 60);
  const [showResult, setShowResult] = useState(false);

  // Маалыматты форматтоо жана аралаштыруу
  const quizData = useMemo(() => {
    if (!data || data.length === 0) return [];
    const formatted = data.map(item => {
      const getIndices = (lKey) => {
        const options = item.options[lKey];
        const correct = item.correctAnswer[lKey];
        const correctArr = Array.isArray(correct) ? correct : [correct];
        return correctArr.map(val => options.indexOf(val)).filter(idx => idx !== -1);
      };
      return {
        ...item,
        question_ky: item.question.ky,
        question_ru: item.question.ru,
        options_ky: item.options.ky,
        options_ru: item.options.ru,
        correctIndices: getIndices('ky')
      };
    });
    return [...formatted].sort(() => 0.5 - Math.random()).slice(0, 30);
  }, [data]);

  useEffect(() => {
    let timer;
    if (isStarted && timeLeft > 0 && !showResult) {
      timer = setInterval(() => setTimeLeft(prev => prev - 1), 1000);
    } else if (timeLeft === 0) {
      setShowResult(true);
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
      start: "Тестти баштоо", next: "Кийинки", prev: "Артка", finish: "Жыйынтыктоо", 
      time: "Убакыт", correct: "Туура", wrong: "Ката", noAns: "Жоопсуз", 
      review: "Каталар менен иштөө", trueAns: "Туура жооп:",
      testOver: "Тест аяктады!", restart: "Кайра баштоо", loading: "Жүктөлүүдө..."
    },
    ru: { 
      start: "Начать тест", next: "Далее", prev: "Назад", finish: "Завершить", 
      time: "Время", correct: "Правильно", wrong: "Неправильно", noAns: "Без ответа", 
      review: "Работа над ошибками", trueAns: "Правильный ответ:",
      testOver: "Тест завершен!", restart: "Начать заново", loading: "Загрузка..."
    }
  }[lang];

  const handleOptionClick = (index) => {
    const question = quizData[currentQuestion];
    let currentSelected = userAnswers[currentQuestion] || [];
    if (question.type === 'radio') {
      currentSelected = [index];
    } else {
      currentSelected = currentSelected.includes(index)
        ? currentSelected.filter(i => i !== index)
        : [...currentSelected, index];
    }
    setUserAnswers({ ...userAnswers, [currentQuestion]: currentSelected });
  };

  const calculateStats = () => {
    let correct = 0, wrong = 0, unanswered = 0;
    quizData.forEach((q, idx) => {
      const ans = userAnswers[idx];
      if (!ans || ans.length === 0) { unanswered++; } 
      else {
        const isCorrect = ans.length === q.correctIndices.length && ans.every(v => q.correctIndices.includes(v));
        isCorrect ? correct++ : wrong++;
      }
    });
    return { correct, wrong, unanswered };
  };

  // Тил которгуч компоненти (SVG менен)
  const LangSwitcher = () => (
    <div className="lang-switcher-container">
      <button className={`lang-btn ${lang === 'ky' ? 'active' : ''}`} onClick={() => setLang('ky')}>
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>
        KG
      </button>
      <button className={`lang-btn ${lang === 'ru' ? 'active' : ''}`} onClick={() => setLang('ru')}>
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>
        RU
      </button>
    </div>
  );

  if (quizData.length === 0) return <div className="quiz-main-container"><div className="loader">{t.loading}</div></div>;

  // 1. СТАРТ ЭКРАНЫ
  if (!isStarted) {
    return (
      <div className="quiz-main-container result-centered">
        <div className="quiz-card result-box">
          <LangSwitcher />
          <h1 className="active-title-name" style={{fontSize: '24px', margin: '20px 0'}}>{lang === 'ky' ? titleKy : titleRu}</h1>
          <p className="score-text" style={{margin: '0 0 30px'}}>30 {lang === 'ky' ? 'суроо' : 'вопросов'} • 30 {lang === 'ky' ? 'мүнөт' : 'минут'}</p>
          <button className="next-btn active" onClick={() => setIsStarted(true)}>{t.start}</button>
        </div>
      </div>
    );
  }

  // 2. ЖЫЙЫНТЫК ЭКРАНЫ
  if (showResult) {
    const { correct, wrong, unanswered } = calculateStats();
    return (
      <div className="quiz-main-container">
        <div className="quiz-card result-box review-mode">
          <h1 className="active-title-name">{t.testOver}</h1>
          <div className="stat-grid">
            <div className="stat-item correct">{t.correct}: {correct}</div>
            <div className="stat-item wrong">{t.wrong}: {wrong}</div>
            <div className="stat-item empty">{t.noAns}: {unanswered}</div>
          </div>
          <div className="score-summary">
            <p className="score-text">Жыйынтык: <span>{correct} / {quizData.length}</span></p>
          </div>
          <div className="review-list">
            <h3 className="review-title">{t.review}</h3>
            {quizData.map((q, idx) => {
              const ans = userAnswers[idx] || [];
              const isCorrect = ans.length === q.correctIndices.length && ans.every(v => q.correctIndices.includes(v));
              if (isCorrect) return null;
              return (
                <div key={idx} className="review-item">
                  <p className="review-question">{idx + 1}. {lang === 'ky' ? q.question_ky : q.question_ru}</p>
                  <p className="your-ans">{t.wrong}: {ans.map(i => (lang === 'ky' ? q.options_ky[i] : q.options_ru[i])).join(', ') || t.noAns}</p>
                  <p className="correct-ans">{t.trueAns} {q.correctIndices.map(i => (lang === 'ky' ? q.options_ky[i] : q.options_ru[i])).join(', ')}</p>
                </div>
              );
            })}
          </div>
          <button className="next-btn active restart-btn" onClick={() => window.location.reload()}>{t.restart}</button>
        </div>
      </div>
    );
  }

  // 3. ТЕСТ ЭКРАНЫ
  const currentQ = quizData[currentQuestion];
  const isSelected = (index) => (userAnswers[currentQuestion] || []).includes(index);

  return (
    <div className="quiz-main-container">
      <div className="quiz-card">
        <div className="quiz-header">
          <div className="quiz-header-left" style={{display: 'flex', alignItems: 'center', gap: '15px'}}>
            <span className="quiz-category-tag">{lang === 'ky' ? titleKy : titleRu}</span>
            <div className="timer-badge">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                <span className="timer">{formatTime(timeLeft)}</span>
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
            <div key={i} className={`option-card ${isSelected(i) ? 'selected' : ''}`} onClick={() => handleOptionClick(i)}>
              <div className={`check-indicator ${currentQ.type}`}>
                {isSelected(i) && <div className="check-dot" />}
              </div>
              <span className="option-label">{opt}</span>
            </div>
          ))}
        </div>

        <div className="nav-btns">
          <button className="next-btn prev-btn" disabled={currentQuestion === 0} onClick={() => setCurrentQuestion(prev => prev - 1)} style={{marginTop: 0, width: '48%', background: '#f1f3f5', color: '#4a4a4a'}}>
            {t.prev}
          </button>
          <button 
            className={`next-btn ${(!userAnswers[currentQuestion] || userAnswers[currentQuestion].length === 0) ? 'disabled' : 'active'}`}
            style={{marginTop: 0, width: '48%'}}
            disabled={!userAnswers[currentQuestion] || userAnswers[currentQuestion].length === 0}
            onClick={() => currentQuestion === quizData.length - 1 ? setShowResult(true) : setCurrentQuestion(prev => prev + 1)}
          >
            {currentQuestion === quizData.length - 1 ? t.finish : t.next}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Test;