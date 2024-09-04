import React, { useState } from 'react';
import styles from './Form.module.css';
import { JigsawStack } from 'jigsawstack';

function Translate() {
    const [inputText, setInputText] = useState('');
    const [targetLanguage, setTargetLanguage] = useState('es');
    const [translationResult, setTranslationResult] = useState('');
    const [loading, setLoading] = useState(false);

    const languages = [
        { code: 'es', name: 'Spanish' },
        { code: 'fr', name: 'French' },
        { code: 'de', name: 'German' },
        { code: 'zh', name: 'Chinese' },
        { code: 'hi', name: 'Hindi' },

    ];

    const handleChangeText = (e) => setInputText(e.target.value);

    const handleChangeLanguage = (e) => setTargetLanguage(e.target.value);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        const jigsawstack = JigsawStack({
            apiKey: process.env.NEXT_PUBLIC_JIGSAWSTACK_API_KEY,
        });

        try {
            const result = await jigsawstack.translate({
                current_language: 'en',
                target_language: targetLanguage,
                text: inputText,
            });

            if (result.success && result.translated_text) {

                const translatedTextArray = Array.from(result.translated_text);


                const startIndex = translatedTextArray.findIndex(char => char === ':') + 1;


                const cleanTranslation = translatedTextArray.slice(startIndex).join('').trim();

                setTranslationResult(cleanTranslation);
            } else {
                setTranslationResult('Failed to translate text or no translation available.');
            }
        } catch (error) {
            console.error('An error occurred:', error);
            setTranslationResult('An error occurred while processing your request.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <form className={styles.form} onSubmit={handleSubmit}>
            <h2 className={styles.heading}>Translate Text</h2>
            <input
                type="text"
                value={inputText}
                onChange={handleChangeText}
                placeholder="Enter text to translate"
                className={styles.input}
            />
            <select value={targetLanguage} onChange={handleChangeLanguage} className={styles.input}>
                {languages.map((lang) => (
                    <option key={lang.code} value={lang.code}>
                        {lang.name} ({lang.code})
                    </option>
                ))}
            </select>
            <button className={styles.button} type="submit" disabled={loading}>
                {loading ? 'Translating...' : 'Translate'}
            </button>

            {translationResult && (
                <div className={styles.result}>
                    <h3 className={styles.heading}>Translation Result:</h3>
                    <p className={styles.font}>{translationResult}</p>
                </div>
            )}
        </form>
    );
}

export default Translate;
