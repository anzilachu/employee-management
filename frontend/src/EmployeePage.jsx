import { useState, useEffect } from 'react';
import axios from 'axios';

const FORMS_API = 'http://localhost:8000/api/forms/forms/';
const EMP_API = 'http://localhost:8000/api/employees/employees/';

export default function EmployeePage() {
  const [forms, setForms] = useState([]);
  const [selected, setSelected] = useState('');
  const [fields, setFields] = useState([]);
  const [data, setData] = useState({});
  const [msg, setMsg] = useState('');
  const token = localStorage.getItem('token');

  useEffect(() => { fetchForms(); }, []);
  const fetchForms = async () => {
    const res = await axios.get(FORMS_API, { headers: { Authorization: `Bearer ${token}` } });
    setForms(res.data);
  };

  const handleSelect = e => {
    setSelected(e.target.value);
    const form = forms.find(f => f.id === parseInt(e.target.value));
    setFields(form ? form.fields : []);
    setData({});
  };

  const handleChange = e => setData(d => ({ ...d, [e.target.name]: e.target.value }));

  const createEmployee = async e => {
    e.preventDefault();
    try {
      await axios.post(EMP_API, { form: selected, data }, { headers: { Authorization: `Bearer ${token}` } });
      setMsg('Employee created');
      setData({});
    } catch { setMsg('Failed to create employee'); }
  };

  return (
    <div>
      <h3>Create Employee</h3>
      <select value={selected} onChange={handleSelect}>
        <option value="">Select Form</option>
        {forms.map(f => <option key={f.id} value={f.id}>{f.name}</option>)}
      </select>
      {fields.length > 0 && (
        <form onSubmit={createEmployee}>
          {fields.map(f => (
            <div key={f.id}>
              <label>{f.label}: </label>
              <input
                name={f.label}
                type={f.field_type === 'password' ? 'password' : f.field_type}
                required={f.required}
                onChange={handleChange}
                value={data[f.label] || ''}
              />
            </div>
          ))}
          <button type="submit">Create</button>
        </form>
      )}
      {msg && <div>{msg}</div>}
    </div>
  );
} 