"use client";

import React, { useState } from 'react';
import Summary from './components/Summary';
import Scrape from './components/Scrape';
import ArticleSummary from './components/ArticleSummary';
import Sequelizer from './components/Sequelizer';
import Prompt from './components/Prompt';
import Translate from './components/Translate';
import Emotion from './components/Emotion';
import { MdOutlineLightMode } from "react-icons/md";
import { MdDarkMode } from "react-icons/md";

import styles from './App.module.css';

function App() {
  const [activeComponent, setActiveComponent] = useState('translate');
  const [isDarkMode, setIsDarkMode] = useState(true);

  const handleNavClick = (component) => {
    setActiveComponent(component);
  };

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
  };

  return (
    <div className={`${isDarkMode ? styles.dark : styles.light} ${styles.container}`}>
      <nav className={styles.nav}>
        <div className={styles['nav-left']}>
          <span className={styles.name}>Jigsaw Playground</span>
        </div>
        <div className={styles['nav-center']}>
          <button
            className={activeComponent === 'translate' ? styles.active : ''}
            onClick={() => handleNavClick('translate')}
          >
            Translate
          </button>
          <button
            className={activeComponent === 'prompt' ? styles.active : ''}
            onClick={() => handleNavClick('prompt')}
          >
            Dad jokes
          </button>
          <button
            className={activeComponent === 'article-summary' ? styles.active : ''}
            onClick={() => handleNavClick('article-summary')}
          >
            Article Summary
          </button>
          <button
            className={activeComponent === 'emotion' ? styles.active : ''}
            onClick={() => handleNavClick('emotion')}
          >
            Sentiment Analysis
          </button>
          <button
            className={activeComponent === 'sequelizer' ? styles.active : ''}
            onClick={() => handleNavClick('sequelizer')}
          >
            Generate SQL queries
          </button>
          <button
            className={activeComponent === 'summary' ? styles.active : ''}
            onClick={() => handleNavClick('summary')}
          >
            Text Summary
          </button>
          <button
            className={activeComponent === 'scrape' ? styles.active : ''}
            onClick={() => handleNavClick('scrape')}
          >
            AI Scraper
          </button>
        </div>
        <div className={styles['nav-right']}>
          <span
            className={styles.themeToggle}
            onClick={toggleTheme}
          >
            {isDarkMode ? <MdOutlineLightMode /> : <MdDarkMode />}
          </span>
        </div>
      </nav>

      <div className={styles.content}>
        {activeComponent === 'translate' && <Translate />}
        {activeComponent === 'prompt' && <Prompt />}
        {activeComponent === 'article-summary' && <ArticleSummary />}
        {activeComponent === 'emotion' && <Emotion />}
        {activeComponent === 'sequelizer' && <Sequelizer />}
        {activeComponent === 'summary' && <Summary />}
        {activeComponent === 'scrape' && <Scrape />}
      </div>
    </div>
  );
}

export default App;
