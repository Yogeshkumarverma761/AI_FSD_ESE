import React, { useState, useEffect } from 'react';
import api from '../utils/api';

const EmployeeList = () => {
  const [employees, setEmployees] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = async (query = '') => {
    try {
      const endpoint = query ? `/employees/search?department=${query}` : '/employees';
      const res = await api.get(endpoint);
      setEmployees(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    fetchEmployees(search);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this employee?')) {
      try {
        await api.delete(`/employees/${id}`);
        setEmployees(employees.filter(emp => emp._id !== id));
      } catch (err) {
        console.error(err);
      }
    }
  };

  return (
    <div>
      <div className="glass-card" style={{ marginBottom: '20px' }}>
        <h2>Employee Directory</h2>
        <form onSubmit={handleSearch} className="search-bar" style={{ marginTop: '15px' }}>
          <input 
            type="text" 
            className="form-input" 
            placeholder="Search by Department..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <button type="submit" className="btn btn-secondary">Search</button>
          {search && <button type="button" className="btn" onClick={() => { setSearch(''); fetchEmployees(); }}>Clear</button>}
        </form>
      </div>

      {loading ? <p>Loading...</p> : (
        <div className="employee-grid">
          {employees.map(emp => (
            <div key={emp._id} className="employee-card">
              <h3 style={{ marginBottom: '10px' }}>{emp.name}</h3>
              <p><strong>Email:</strong> {emp.email}</p>
              <p><strong>Department:</strong> {emp.department}</p>
              <p><strong>Performance:</strong> {emp.performanceScore}/100</p>
              <p><strong>Experience:</strong> {emp.experience} years</p>
              <div style={{ marginTop: '10px', marginBottom: '15px' }}>
                {emp.skills.map(skill => <span key={skill} className="badge">{skill}</span>)}
              </div>
              <button onClick={() => handleDelete(emp._id)} className="btn btn-danger" style={{ padding: '6px 12px', fontSize: '12px' }}>Delete</button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default EmployeeList;
