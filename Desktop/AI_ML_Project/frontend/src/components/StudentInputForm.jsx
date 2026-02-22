import React, { useState } from 'react';

const StudentInputForm = ({ onPredict, loading }) => {
    const [formData, setFormData] = useState({
        quiz_scores: 75,
        test_scores: 80,
        maths_score: 70,
        reading: 65,
        writing: 60,
        time_spent: 4,
        communication: 50
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: parseFloat(value) || 0
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onPredict(formData);
    };

    const fields = [
        { name: 'quiz_scores', label: 'Quiz Scores', min: 0, max: 100 },
        { name: 'test_scores', label: 'Test Scores', min: 0, max: 100 },
        { name: 'maths_score', label: 'Maths Score', min: 0, max: 100 },
        { name: 'reading', label: 'Reading Score', min: 0, max: 100 },
        { name: 'writing', label: 'Writing Score', min: 0, max: 100 },
        { name: 'time_spent', label: 'Study Hours (Daily)', min: 0.5, max: 12, step: 0.5 },
        { name: 'communication', label: 'Communication (%)', min: 0, max: 100 },
    ];

    return (
        <div className="input-wrapper" style={{ padding: '30px', maxWidth: '600px', margin: '0 auto' }}>
            <h2 style={{ textAlign: 'center', marginBottom: '25px', color: 'var(--text-primary)' }}>Student Feature Entry</h2>
            <form onSubmit={handleSubmit} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                {fields.map(field => (
                    <div key={field.name} style={{ display: 'flex', flexDirection: 'column' }}>
                        <label style={{ fontSize: '0.9rem', marginBottom: '8px', color: 'var(--text-muted)' }}>{field.label}</label>
                        <input
                            type="number"
                            name={field.name}
                            value={formData[field.name]}
                            onChange={handleChange}
                            min={field.min}
                            max={field.max}
                            step={field.step || 1}
                            style={{
                                padding: '12px',
                                borderRadius: '8px',
                                border: '1px solid rgba(255,255,255,0.1)',
                                background: 'rgba(255,255,255,0.05)',
                                color: '#fff',
                                outline: 'none'
                            }}
                        />
                    </div>
                ))}
                <div style={{ gridColumn: 'span 2', marginTop: '10px' }}>
                    <button
                        type="submit"
                        className="analyze-btn"
                        disabled={loading}
                        style={{ width: '100%', padding: '15px' }}
                    >
                        {loading ? 'Predicting Risk...' : 'Analyze Risk & Insights'}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default StudentInputForm;
