import { useState, useEffect } from 'react';
import axios from 'axios';

const EMP_API = 'http://localhost:8000/api/employees/employees/';
const FORMS_API = 'http://localhost:8000/api/forms/forms/';

const inputStyle = {
  minWidth: 80,
  background: '#fff',
  color: '#111',
  border: '1px solid #ddd',
  borderRadius: 4,
  padding: '8px 12px',
  marginRight: 8,
  '::placeholder': { color: '#111' }
};

export default function EmployeeListPage() {
  const [employees, setEmployees] = useState([]);
  const [forms, setForms] = useState([]);
  const [form, setForm] = useState('');
  const [search, setSearch] = useState({});
  const [msg, setMsg] = useState('');
  const [editId, setEditId] = useState(null);
  const [editData, setEditData] = useState({});
  const [editFields, setEditFields] = useState([]);
  const token = localStorage.getItem('token');

  useEffect(() => { fetchForms(); }, []);
  useEffect(() => { if (form) fetchEmployees({ form }); }, [form]);

  const fetchForms = async () => {
    const res = await axios.get(FORMS_API, { headers: { Authorization: `Bearer ${token}` } });
    setForms(res.data);
    if (res.data.length > 0 && !form) setForm(res.data[0].id.toString());
  };
  const fetchEmployees = async (params = {}) => {
    const res = await axios.get(EMP_API, { headers: { Authorization: `Bearer ${token}` }, params });
    setEmployees(res.data);
  };

  const handleForm = e => {
    setForm(e.target.value);
    setSearch({});
    setEditId(null);
    setEditFields([]);
    setEditData({});
  };

  const handleSearch = e => setSearch(s => ({ ...s, [e.target.name]: e.target.value }));
  const doSearch = () => {
    const params = { form };
    Object.entries(search).forEach(([k, v]) => { if (v) params[`field_${k}`] = v; });
    fetchEmployees(params);
  };

  const del = async id => {
    await axios.delete(`${EMP_API}${id}/`, { headers: { Authorization: `Bearer ${token}` } });
    setMsg('Deleted');
    fetchEmployees({ form });
  };

  // Edit logic
  const startEdit = (emp) => {
    setEditId(emp.id);
    setEditData(emp.data);
    const formObj = forms.find(f => f.id === emp.form);
    setEditFields(formObj ? formObj.fields : []);
  };
  const handleEditChange = e => setEditData(d => ({ ...d, [e.target.name]: e.target.value }));
  const saveEdit = async () => {
    const emp = employees.find(e => e.id === editId);
    const formId = emp ? emp.form : null;
    await axios.put(`${EMP_API}${editId}/`, { form: formId, data: editData }, { headers: { Authorization: `Bearer ${token}` } });
    setMsg('Updated');
    setEditId(null);
    fetchEmployees({ form });
  };
  const cancelEdit = () => setEditId(null);

  // Get field labels for the selected form
  const fieldLabels = form ? (forms.find(f => f.id === parseInt(form))?.fields.map(f => f.label) || []) : [];

  // Placeholder style for black text
  const placeholderStyle = `::placeholder { color: #111 !important; opacity: 1; }`;

  // Status messages
  if (forms.length === 0) {
    return <div style={{ marginTop: 40, fontWeight: 500 }}>No forms created yet.</div>;
  }

  return (
    <div>
      <style>{placeholderStyle}</style>
      <h3>Employee List</h3>
      <select value={form} onChange={handleForm}>
        {forms.map(f => <option key={f.id} value={f.id}>{f.name}</option>)}
      </select>
      {/* Search row above the table, horizontal layout */}
      {fieldLabels.length > 0 && (
        <div style={{ display: 'flex', flexDirection: 'row', gap: 8, margin: '16px 0', alignItems: 'center', flexWrap: 'nowrap', overflowX: 'auto', width: '100%' }}>
          {fieldLabels.map(label => (
            <input
              key={label}
              name={label}
              placeholder={label}
              onChange={handleSearch}
              style={inputStyle}
            />
          ))}
          <button onClick={doSearch} style={{ height: 40, whiteSpace: 'nowrap' }}>Search</button>
        </div>
      )}
      {msg && <div>{msg}</div>}
      {employees.length === 0 ? (
        <div style={{ marginTop: 40, fontWeight: 500 }}>The form is empty.</div>
      ) : (
        <table border="1" cellPadding="5">
          <thead>
            <tr>
              <th>ID</th>
              <th>Form</th>
              {fieldLabels.map(label => <th key={label}>{label}</th>)}
              <th>Created</th>
              <th>Edit</th>
              <th>Delete</th>
            </tr>
          </thead>
          <tbody>
            {employees.map(e => (
              <tr key={e.id}>
                <td>{e.id}</td>
                <td>{e.form_name}</td>
                {editId === e.id ? (
                  fieldLabels.map(label => {
                    const fieldDef = editFields.find(f => f.label === label);
                    if (fieldDef) {
                      return (
                        <td key={label}>
                          <input
                            name={label}
                            type={fieldDef.field_type === 'password' ? 'password' : fieldDef.field_type || 'text'}
                            required={fieldDef.required}
                            onChange={handleEditChange}
                            value={editData[label] || ''}
                            style={inputStyle}
                          />
                        </td>
                      );
                    } else {
                      return <td key={label}></td>;
                    }
                  })
                ) : (
                  fieldLabels.map(label => (
                    <td key={label}>{e.data[label] || ''}</td>
                  ))
                )}
                <td>{e.created_at}</td>
                <td>
                  {editId === e.id ? (
                    <>
                      <button onClick={saveEdit}>Save</button>
                      <button onClick={cancelEdit}>Cancel</button>
                    </>
                  ) : (
                    <button onClick={() => startEdit(e)}>Edit</button>
                  )}
                </td>
                <td><button onClick={() => del(e.id)}>Delete</button></td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
} 