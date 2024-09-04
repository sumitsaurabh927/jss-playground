import React, { useState } from 'react';
import styles from './Form.module.css';
import { JigsawStack } from 'jigsawstack';

function Scrape() {
    const [inputValue, setInputValue] = useState('');
    const [result, setResult] = useState(null);
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => setInputValue(e.target.value);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        const jigsawstack = JigsawStack({
            apiKey: process.env.NEXT_PUBLIC_JIGSAWSTACK_API_KEY,
        });

        try {
            const response = await jigsawstack.web.ai_scrape({
                url: inputValue,
                element_prompts: ['prices'],
            });

            if (response.data) {
                setResult(response.data);
            } else {
                setResult('No data found');
            }
        } catch (error) {
            console.error('An error occurred:', error);
            setResult('An error occurred while processing your request');
        } finally {
            setLoading(false);
        }
    };

    const renderResult = () => {
        if (!result) return null;

        if (typeof result === 'string') {
            return (
                <div className={styles.result}>
                    <h3 className={styles.heading}>Result:</h3>
                    <p>{result}</p>
                </div>
            );
        }

        return (
            <div className={styles.result}>
                <h3 className={styles.heading}>Scraped Data:</h3>
                {result.map((item, index) => (
                    <div key={index} className={styles.font}>
                        <h4>Selector: {item.selector}</h4>
                        <ul>
                            {item.results.map((resultItem, resultIndex) => (
                                <li key={resultIndex} className={styles.resultItem}>
                                    <span>Text:</span> {resultItem.text}
                                </li>
                            ))}
                        </ul>
                    </div>
                ))}
            </div>
        );
    };

    return (
        <form className={styles.form} onSubmit={handleSubmit}>
            <h2 className={styles.heading}>AI Scrape</h2>
            <input
                type="text"
                value={inputValue}
                onChange={handleChange}
                placeholder="Enter URL to scrape data"
                className={styles.input}
            />
            <button className={styles.button} type="submit" disabled={loading}>
                {loading ? 'Scraping...' : 'Submit'}
            </button>

            {renderResult()}
        </form>
    );
}

export default Scrape;
