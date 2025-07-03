import { useState } from 'react';
import axios from 'axios';

const API = 'http://localhost:8000/api/auth';

export default function AuthPage() {
  const [view, setView] = useState('login');
  const [token, setToken] = useState(localStorage.getItem('token') || '');
  const [profile, setProfile] = useState(null);
  const [form, setForm] = useState({ username: '', email: '', password: '', old_password: '', new_password: '' });
  const [msg, setMsg] = useState('');

  const handleChange = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }));

  const login = async e => {
    e.preventDefault();
    try {
      const res = await axios.post(`${API}/login/`, { username: form.username, password: form.password });
      setToken(res.data.access);
      localStorage.setItem('token', res.data.access);
      setMsg('Login successful');
    } catch (err) { setMsg('Login failed'); }
  };

  const register = async e => {
    e.preventDefault();
    try {
      await axios.post(`${API}/register/`, { username: form.username, email: form.email, password: form.password });
      setMsg('Registration successful');
    } catch (err) { setMsg('Registration failed'); }
  };

  const getProfile = async () => {
    try {
      const res = await axios.get(`${API}/profile/`, { headers: { Authorization: `Bearer ${token}` } });
      setProfile(res.data);
      setMsg('Profile loaded');
    } catch (err) {
      if (!token || (err.response && err.response.status === 401)) {
        setMsg('You are not logged in');
      } else {
        setMsg('Failed to load profile');
      }
    }
  };

  const changePassword = async e => {
    e.preventDefault();
    try {
      await axios.post(`${API}/change-password/`, { old_password: form.old_password, new_password: form.new_password }, { headers: { Authorization: `Bearer ${token}` } });
      setMsg('Password changed');
    } catch (err) {
      if (!token || (err.response && err.response.status === 401)) {
        setMsg('You are not logged in');
      } else {
        setMsg('Failed to change password');
      }
    }
  };

  return (
    <div>
      <div style={{ marginBottom: 10, display: 'flex', flexDirection: 'row', gap: 10, justifyContent: 'center', alignItems: 'center' }}>
        <button onClick={() => setView('login')}>Login</button>
        <button onClick={() => setView('register')}>Register</button>
        <button onClick={() => setView('profile')}>Profile</button>
        <button onClick={() => setView('change')}>Change Password</button>
      </div>
      {msg && <div>{msg}</div>}
      {view === 'login' && (
        <form onSubmit={login}>
          <input name="username" placeholder="Username" onChange={handleChange} />
          <input name="password" type="password" placeholder="Password" onChange={handleChange} />
          <button type="submit">Login</button>
        </form>
      )}
      {view === 'register' && (
        <form onSubmit={register}>
          <input name="username" placeholder="Username" onChange={handleChange} />
          <input name="email" placeholder="Email" onChange={handleChange} />
          <input name="password" type="password" placeholder="Password" onChange={handleChange} />
          <button type="submit">Register</button>
        </form>
      )}
      {view === 'profile' && (
        <div>
          <button onClick={getProfile}>Load Profile</button>
          {profile && <pre>{JSON.stringify(profile, null, 2)}</pre>}
        </div>
      )}
      {view === 'change' && (
        <form onSubmit={changePassword}>
          <input name="old_password" type="password" placeholder="Old Password" onChange={handleChange} />
          <input name="new_password" type="password" placeholder="New Password" onChange={handleChange} />
          <button type="submit">Change Password</button>
        </form>
      )}
    </div>
  );
} 