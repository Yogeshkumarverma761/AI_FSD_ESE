import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../utils/api';

const EmployeeRegistration = () => {
  const [formData, setFormData] = useState({
    name: '', email: '', department: '', skills: '', performanceScore: '', experience: ''
  });
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');
    try {
      const payload = {
        ...formData,
        skills: formData.skills.split(',').map(s => s.trim()),
        performanceScore: Number(formData.performanceScore),
        experience: Number(formData.experience)
      };
      const res = await api.post('/employees', payload);
      setMessage(res.data.msg);
      setTimeout(() => navigate('/'), 2000);
    } catch (err) {
      setError(err.response?.data?.msg || 'Error adding employee');
    }
  };

  return (
    <div className="glass-card" style={{ maxWidth: '600px', margin: '0 auto' }}>
      <h2 style={{ marginBottom: '20px' }}>Register New Employee</h2>
      {message && <div style={{ color: 'var(--secondary)', marginBottom: '15px' }}>{message}</div>}
      {error && <div style={{ color: 'var(--danger)', marginBottom: '15px' }}>{error}</div>}
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label className="form-label">Full Name</label>
          <input type="text" name="name" className="form-input" onChange={handleChange} required />
        </div>
        <div className="form-group">
          <label className="form-label">Email</label>
          <input type="email" name="email" className="form-input" onChange={handleChange} required />
        </div>
        <div className="form-group">
          <label className="form-label">Department</label>
          <input type="text" name="department" className="form-input" onChange={handleChange} required />
        </div>
        <div className="form-group">
          <label className="form-label">Skills (comma separated)</label>
          <input type="text" name="skills" className="form-input" onChange={handleChange} placeholder="React, Node.js, MongoDB" required />
        </div>
        <div className="form-group">
          <label className="form-label">Performance Score (0-100)</label>
          <input type="number" name="performanceScore" className="form-input" onChange={handleChange} required />
        </div>
        <div className="form-group">
          <label className="form-label">Years of Experience</label>
          <input type="number" name="experience" className="form-input" onChange={handleChange} required />
        </div>
        <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>Register Employee</button>
      </form>
    </div>
  );
};

export default EmployeeRegistration;
