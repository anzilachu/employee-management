import { BrowserRouter as Router, Routes, Route, Link, useLocation, useNavigate } from 'react-router-dom';
import AuthPage from './AuthPage';
import FormBuilderPage from './FormBuilderPage';
import EmployeePage from './EmployeePage';
import EmployeeListPage from './EmployeeListPage';
import { useState } from 'react';

function ProtectedRoute({ children, onNotLoggedIn }) {
  const token = localStorage.getItem('token');
  const location = useLocation();
  const navigate = useNavigate();
  if (!token) {
    onNotLoggedIn && onNotLoggedIn();
    // Redirect to /auth but keep the current URL in history
    setTimeout(() => {
      if (location.pathname !== '/auth') navigate('/auth', { replace: true });
    }, 0);
    return null;
  }
  return children;
}

function App() {
  const [showAlert, setShowAlert] = useState(false);
  const handleNotLoggedIn = () => {
    setShowAlert(true);
    setTimeout(() => setShowAlert(false), 6000);
  };
  return (
    <Router>
      <nav style={{ display: 'flex', gap: 10, marginBottom: 20 }}>
        <Link to="/auth">Auth</Link>
        <Link to="/forms">Form Builder</Link>
        <Link to="/employee">Create Employee</Link>
        <Link to="/employees">Employee List</Link>
      </nav>
      {showAlert && (
        <div style={{ position: 'fixed', top: 30, left: 0, right: 0, margin: '0 auto', zIndex: 1000, background: '#111', color: '#fff', padding: 16, borderRadius: 8, maxWidth: 320, textAlign: 'center' }}>
          You are not logged in.
        </div>
      )}
      <Routes>
        <Route path="/auth" element={<AuthPage />} />
        <Route path="/forms" element={<ProtectedRoute onNotLoggedIn={handleNotLoggedIn}><FormBuilderPage /></ProtectedRoute>} />
        <Route path="/employee" element={<ProtectedRoute onNotLoggedIn={handleNotLoggedIn}><EmployeePage /></ProtectedRoute>} />
        <Route path="/employees" element={<ProtectedRoute onNotLoggedIn={handleNotLoggedIn}><EmployeeListPage /></ProtectedRoute>} />
        <Route path="*" element={<div>Welcome! Use the nav above.</div>} />
      </Routes>
    </Router>
  );
}

export default App;
