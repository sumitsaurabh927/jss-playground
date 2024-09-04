import React, { useState } from 'react';
import styles from './Form.module.css';
import { JigsawStack } from 'jigsawstack';

function Emotion() {
    const [inputText, setInputText] = useState('');
    const [emotionResult, setEmotionResult] = useState(null);
    const [loading, setLoading] = useState(false);

    const handleChangeText = (e) => {
        setInputText(e.target.value);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        const jigsawstack = JigsawStack({
            apiKey: process.env.NEXT_PUBLIC_JIGSAWSTACK_API_KEY,
        });

        try {
            const response = await jigsawstack.sentiment({ text: inputText });

            if (response.success) {
                setEmotionResult(response.sentiment);
            } else {
                console.error('Failed to analyze sentiment');
                setEmotionResult({
                    emotion: 'Unknown',
                    sentiment: 'Failed to analyze sentiment',
                });
            }
        } catch (error) {
            console.error('An error occurred:', error);
            setEmotionResult({
                emotion: 'Error',
                sentiment: 'An error occurred while processing your request.',
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <form className={styles.form} onSubmit={handleSubmit}>
            <h2 className={styles.heading}>Sentiment Analysis</h2>
            <textarea
                value={inputText}
                onChange={handleChangeText}
                placeholder="Enter text to analyze"
                rows="4"
                className={styles.textarea}
            />
            <button
                className={styles.button}
                type="submit"
                disabled={loading}
            >
                {loading ? 'Analyzing...' : 'Submit'}
            </button>

            {emotionResult && (
                <div className={styles.result}>
                    <h3 className={styles.heading}>Analysis Result:</h3>
                    <p className={styles.font}>
                        <strong>Emotion:</strong> {emotionResult.emotion}
                    </p>
                    <p className={styles.font}>
                        <strong>Sentiment:</strong> {emotionResult.sentiment}
                    </p>
                </div>
            )}
        </form>
    );
}

export default Emotion;
