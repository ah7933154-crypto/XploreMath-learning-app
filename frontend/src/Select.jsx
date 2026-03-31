import React from 'react';
import { useNavigate } from 'react-router-dom';
import { BookOpen, Trophy, TrendingUp, ChevronRight } from 'lucide-react';
import { ChevronLeft, HelpCircle, ClipboardCheck, Calculator, Infinity } from 'lucide-react';
import Footer from './Footer';
import './Select.css';
import { FaQuestion, FaBookOpen, FaCalculator, FaCheckCircle } from 'react-icons/fa';

const Select = () => {
  const navigate = useNavigate();
  const handleBack = () => {
    navigate(-1); // Go back to previous page
  };

  
   return (
    <div className="select-wrapper">
      {/* Background Decor for continuity */}
      <div className="select-bg-decor">
        <div className="select-blob blob-top"></div>
        <div className="select-blob blob-bottom"></div>
        <div className="select-math-symbol">√x</div>
        <div className="select-math-symbol">sin θ</div>
      </div>

      <div className="select-container">
        <header className="select-header">
          <button className="back-link" onClick={() => navigate('/')}>
            <ChevronLeft size={20} />
            Back to Home
          </button>
        </header>

        <main className="select-main">
          <div className="select-intro">
            <span className="select-badge">Discovery Center</span>
            <h1 className="select-title">What are we <span className="highlight">exploring</span> today?</h1>
            <p className="select-subtitle">Select a module to continue your mathematical journey.</p>
          </div>

          <div className="select-options-grid">
            <div className="option-card" onClick={() => navigate('/questions')}>
              <div className="option-icon-wrapper">
                <HelpCircle size={32} />
              </div>
              <div className="option-content">
                <h3>Questions</h3>
                <p>Browse practice problems and solutions</p>
              </div>
              <div className="option-arrow">
                <ChevronLeft size={20} style={{ transform: 'rotate(180deg)' }} />
              </div>
            </div>

            <div className="option-card" onClick={() => navigate('/formulas')}>
              <div className="option-icon-wrapper">
                <Calculator size={32} />
              </div>
              <div className="option-content">
                <h3>Formulas</h3>
                <p>Quick reference for all math identities</p>
              </div>
              <div className="option-arrow">
                <ChevronLeft size={20} style={{ transform: 'rotate(180deg)' }} />
              </div>
            </div>

            <div className="option-card highlight-card" onClick={() => navigate('/test')}>
              <div className="option-icon-wrapper">
                <ClipboardCheck size={32} />
              </div>
              <div className="option-content">
                <h3>Test Yourself</h3>
                <p>Challenge your mastery with a timed quiz</p>
              </div>
              <div className="option-arrow">
                <ChevronLeft size={20} style={{ transform: 'rotate(180deg)' }} />
              </div>
            </div>


            <div className="option-card highlight-card" onClick={() => navigate('/pre-exercise-notes')}>
              <div className="option-icon-wrapper">
                <Infinity size={32} />
              </div>
              <div className="option-content">
                <h3>Learning Material</h3>
                <p>Review notes before attempting exercises</p>
              </div>
              <div className="option-arrow">
                <ChevronLeft size={20} style={{ transform: 'rotate(180deg)' }} />
              </div>
            </div>
          </div>
        </main>
      </div>

      <footer className="select-footer">
        <p>Ready to level up your skills?</p>
      </footer>
    </div>
  );
};

export default Select;