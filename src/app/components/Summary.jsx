import React, { useState } from 'react';
import styles from './Form.module.css';
import { JigsawStack } from 'jigsawstack';

function Summary() {
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
            const response = await jigsawstack.summary({
                text: inputValue,
                type: "points",
            });

            if (response.success && Array.isArray(response.summary)) {

                const cleanedResult = response.summary.map(point =>
                    point.startsWith('- ') ? point.slice(2) : point
                );
                setResult(cleanedResult);
            } else {
                setResult([]);
            }
        } catch (error) {
            console.error('An error occurred:', error);
            setResult([]);
        } finally {
            setLoading(false);
        }
    };

    return (
        <form className={styles.form} onSubmit={handleSubmit}>
            <h2 className={styles.heading}>AI Text Summariser</h2>
            <input
                type="text"
                value={inputValue}
                onChange={handleChange}
                placeholder="Enter the text to be summarised"
                className={styles.input}
            />
            <button className={styles.button} type="submit" disabled={loading}>
                {loading ? 'Summarising...' : 'Submit'}
            </button>

            {result.length > 0 && (
                <div className={styles.result}>
                    <h3 className={styles.heading}>Result:</h3>
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

export default Summary;