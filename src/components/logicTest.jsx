import React, { useState, useMemo } from 'react';

const LogicTest = ({ data = [], titleKy, titleRu }) => {
  const [lang, setLang] = useState('ky'); // Демейки тил - кыргызча
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [userAnswers, setUserAnswers] = useState({});
  const [isStarted, setIsStarted] = useState(false);
  const [showResult, setShowResult] = useState(false);

  // Маалыматты текшерүү жана аралаштыруу
  const quizData = useMemo(() => {
    if (!data || data.length === 0) return [];
    return [...data].sort(() => 0.5 - Math.random()).slice(0, 30);
  }, [data]);

  if (!data || data.length === 0) {
    return <div className="quiz-main-container">Маалымат жүктөлгөн жок. App.js'ти текшериңиз!</div>;
  }

  // СТАРТ ЭКРАНЫ
  if (!isStarted) {
    return (
      <div className="quiz-main-container result-centered">
        <div className="quiz-card result-box">
          <div style={{display: 'flex', gap: '15px', justifyContent: 'center', marginBottom: '20px'}}>
             <button className={`lang-btn ${lang === 'ky' ? 'active' : ''}`} onClick={() => setLang('ky')}>KG</button>
             <button className={`lang-btn ${lang === 'ru' ? 'active' : ''}`} onClick={() => setLang('ru')}>RU</button>
          </div>
          <h1 className="active-title-name" style={{fontSize: '28px'}}>{lang === 'ky' ? titleKy : titleRu}</h1>
          <button className="next-btn active" onClick={() => setIsStarted(true)}>
            {lang === 'ky' ? "Баштоо" : "Начать"}
          </button>
        </div>
      </div>
    );
  }

  // ЖЫЙЫНТЫК ЭКРАНЫ
  if (showResult) {
    return (
      <div className="quiz-main-container">
        <div className="quiz-card result-box">
          <h1 className="active-title-name">{lang === 'ky' ? "Тест аяктады!" : "Тест завершен!"}</h1>
          <button className="next-btn active" onClick={() => window.location.reload()}>
             {lang === 'ky' ? "Кайра баштоо" : "Начать заново"}
          </button>
        </div>
      </div>
    );
  }

  const currentQ = quizData[currentQuestion];
  if (!currentQ) return null;

  // Тилге жараша маалыматты алуу (Эгер структура объект болсо же түз болсо)
  const questionText = currentQ.question?.[lang] || currentQ.question;
  const options = currentQ.options?.[lang] || currentQ.options;

  const handleOptionClick = (opt) => {
    setUserAnswers({ ...userAnswers, [currentQuestion]: opt });
  };

  return (
    <div className="quiz-main-container">
      <div className="quiz-card">
        <div className="quiz-header" style={{display: 'flex', justifyContent: 'space-between'}}>
          <span className="quiz-category-tag">{lang === 'ky' ? titleKy : titleRu}</span>
          <span className="quiz-counter">{currentQuestion + 1} / {quizData.length}</span>
        </div>

        <h2 className="question-text" style={{marginTop: '25px', minHeight: '80px'}}>
          {questionText}
        </h2>

        <div className="options-grid">
          {options && Array.isArray(options) && options.map((opt, i) => (
            <div 
              key={i} 
              className={`option-card ${userAnswers[currentQuestion] === opt ? 'selected' : ''}`} 
              onClick={() => handleOptionClick(opt)}
            >
              <div className="check-indicator radio">
                {userAnswers[currentQuestion] === opt && <div className="check-dot" />}
              </div>
              <span className="option-label">{opt}</span>
            </div>
          ))}
        </div>

        <div className="nav-btns" style={{marginTop: '30px', display: 'flex', gap: '15px'}}>
          <button className="next-btn prev-btn" disabled={currentQuestion === 0} onClick={() => setCurrentQuestion(prev => prev - 1)}>
            {lang === 'ky' ? "Артка" : "Назад"}
          </button>
          <button 
            className="next-btn active" 
            disabled={!userAnswers[currentQuestion]}
            onClick={() => currentQuestion === quizData.length - 1 ? setShowResult(true) : setCurrentQuestion(prev => prev + 1)}
          >
            {currentQuestion === quizData.length - 1 ? (lang === 'ky' ? "Аяктоо" : "Завершить") : (lang === 'ky' ? "Кийинки" : "Далее")}
          </button>
        </div>
      </div>
    </div>
  );
};

export default LogicTest;