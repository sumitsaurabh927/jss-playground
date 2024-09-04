import React, { useState } from 'react';
import styles from './Form.module.css';

function Prompt() {
    const [inputValue, setInputValue] = useState('');
    const [result, setResult] = useState('');
    const [loading, setLoading] = useState(false);
    const apiKey = process.env.NEXT_PUBLIC_JIGSAWSTACK_API_KEY;

    const handleChange = (e) => setInputValue(e.target.value);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const createResponse = await fetch('https://api.jigsawstack.com/v1/prompt_engine', {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "x-api-key": apiKey
                },
                body: JSON.stringify({
                    prompt: "I am giving you a scene. You have to create dad jokes out of it. The jokes should be clean, family-friendly, and around 100 words. Don't include profanity or NSFW stuff. Just regular, witty dad jokes. It has to be really funny and should make people chuckle a lot. Don't include any introductory text. Just spit out the comic material: {text}",
                    inputs: [
                        {
                            key: "text",
                            optional: false,
                            initial_value: inputValue
                        }
                    ],
                    return_prompt: "Return the result in a text format as a series of paragraphs"
                })
            });

            const createData = await createResponse.json();

            if (createResponse.ok && createData.success) {
                const runResponse = await fetch(`https://api.jigsawstack.com/v1/prompt_engine/${createData.prompt_engine_id}`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        "x-api-key": apiKey
                    },
                    body: JSON.stringify({
                        input_values: { text: inputValue }
                    })
                });

                const runData = await runResponse.json();

                if (runResponse.ok && runData.result) {
                    setResult(runData.result);
                } else {
                    setResult("No result field found in API response.");
                }
            } else {
                setResult(`Failed to create prompt: ${createData.message || 'Unknown error'}`);
            }
        } catch (error) {
            console.error('Error:', error);
            setResult(`An error occurred: ${error.message}. Please check console for more details.`);
        } finally {
            setLoading(false);
        }
    };

    return (
        <form className={styles.form} onSubmit={handleSubmit}>
            <h2 className={styles.heading}>Dad jokes</h2>
            <textarea
                value={inputValue}
                onChange={handleChange}
                placeholder="Enter a situation"
                rows="4"
                className={styles.textarea}
            />
            <button className={styles.button} type="submit" disabled={loading}>
                {loading ? 'Laughter riot starting...' : 'Submit'}
            </button>

            {result && (
                <div className={styles.result}>
                    <h3 className={styles.heading}>Here you go:</h3>
                    {result.split('\n\n').map((paragraph, index) => (
                        <p key={index} className={styles.font}>{paragraph}</p>
                    ))}
                </div>
            )}
        </form>
    );
}

export default Prompt;
