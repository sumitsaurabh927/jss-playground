import React, { useState } from 'react';
import styles from './Form.module.css';
import { JigsawStack } from 'jigsawstack';

const Sequelizer = () => {
    const [prompt, setPrompt] = useState('');
    const [sqlSchema, setSqlSchema] = useState('');
    const [result, setResult] = useState('');
    const [loading, setLoading] = useState(false);

    const handlePromptChange = (e) => setPrompt(e.target.value);
    const handleSchemaChange = (e) => setSqlSchema(e.target.value);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        const jigsawstack = JigsawStack({
            apiKey: process.env.NEXT_PUBLIC_JIGSAWSTACK_API_KEY,
        });

        try {
            const response = await jigsawstack.text_to_sql({
                prompt,
                sql_schema: sqlSchema,
            });

            if (response.success) {
                setResult(response.sql);
            } else {
                console.error('Failed to generate SQL');
                setResult('Failed to generate SQL');
            }
        } catch (error) {
            console.error('An error occurred:', error);
            setResult('An error occurred while processing your request');
        } finally {
            setLoading(false);
        }
    };

    return (
        <form className={styles.form} onSubmit={handleSubmit}>
            <h2 className={styles.heading}>Text to SQL</h2>
            <label>
                <div>SQL Prompt:</div>
                <input
                    type="text"
                    value={prompt}
                    onChange={handlePromptChange}
                    className={styles.input}
                    placeholder="Enter your query prompt"
                />
            </label>
            <label>
                <div >SQL Schema:</div>
                <input
                    type="text"
                    value={sqlSchema}
                    onChange={handleSchemaChange}
                    className={styles.input}
                    placeholder="Enter your SQL schema"
                />
            </label>
            <button className={styles.button} type="submit" disabled={loading}>
                {loading ? 'Generating SQL...' : 'Generate SQL'}
            </button>

            {result && (
                <div className={styles.result}>
                    <h3 className={styles.heading}>Generated SQL:</h3>
                    <p className={styles.font}>{result}</p>
                </div>
            )}
        </form>
    );
};

export default Sequelizer;