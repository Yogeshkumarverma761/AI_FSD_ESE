import React, { useState, useEffect } from 'react';
import api from '../utils/api';

const AIRecommendation = () => {
  const [recommendation, setRecommendation] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const generateInsights = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await api.post('/ai/recommend', {});
      setRecommendation(res.data.recommendation);
    } catch (err) {
      setError(err.response?.data?.msg || 'Failed to generate AI insights');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="glass-card">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h2>AI-Powered Insights & Recommendations</h2>
        <button onClick={generateInsights} className="btn btn-primary" disabled={loading}>
          {loading ? 'Generating...' : 'Generate New Insights'}
        </button>
      </div>
      
      {error && <div style={{ color: 'var(--danger)', marginBottom: '15px' }}>{error}</div>}
      
      {recommendation ? (
        <div className="ai-recommendation-box">
          <h3>🚀 AI Analysis Report</h3>
          <div style={{ whiteSpace: 'pre-wrap', lineHeight: '1.6' }}>
            {recommendation}
          </div>
        </div>
      ) : (
        !loading && <p>Click the button above to generate insights for your workforce.</p>
      )}
    </div>
  );
};

export default AIRecommendation;
