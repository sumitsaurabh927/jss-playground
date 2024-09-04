import React, { useState } from 'react';
import styles from './Form.module.css';
import { JigsawStack } from 'jigsawstack';

function ArticleSummary() {
    const [inputValue, setInputValue] = useState('');
    const [result, setResult] = useState([]);
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => setInputValue(e.target.value);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        const jigsawstack = JigsawStack({
            apiKey: process.env.NEXT_PUBLIC_JIGSAWSTACK_API_KEY,
        });

        try {

            const scrapeResponse = await jigsawstack.web.ai_scrape({
                url: inputValue,
                element_prompts: ["article"],
            });


            let scrapedText = "";
            scrapeResponse.data.forEach((element) => {
                scrapedText += element?.results?.[0]?.text || "";
            });


            const summaryResponse = await jigsawstack.summary({
                text: scrapedText,
                type: "points",
            });

            if (summaryResponse.success && Array.isArray(summaryResponse.summary)) {
                const cleanedResult = summaryResponse.summary.map(point =>
                    point.startsWith('- ') ? point.slice(2) : point
                );
                setResult(cleanedResult);
            } else {
                setResult(['Failed to generate summary']);
            }
        } catch (error) {
            console.error('An error occurred:', error);
            setResult(['An error occurred while processing your request']);
        } finally {
            setLoading(false);
        }
    };

    return (
        <form className={styles.form} onSubmit={handleSubmit}>
            <h2 className={styles.heading}>AI Article Summariser</h2>
            <input
                type="text"
                value={inputValue}
                onChange={handleChange}
                placeholder="Enter article's URL to summarize"
                className={styles.input}
            />
            <button className={styles.button} type="submit" disabled={loading}>
                {loading ? 'Processing...' : 'Submit'}
            </button>

            {result.length > 0 && (
                <div className={styles.result}>
                    <h3 className={styles.heading}>Summary:</h3>
                    <ul>
                        {result.map((point, index) => (
                            <li key={index} className={styles.font}>{point}</li>
                        ))}
                    </ul>
                </div>
            )}
        </form>
    );
}

export default ArticleSummary;
