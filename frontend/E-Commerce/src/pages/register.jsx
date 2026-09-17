import { useState } from "react";
import { registerUser } from '../services/authApi'

function Register({ onSwitchToLogin, onRegistered }) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    setError('');

    try {
      const data = await registerUser(formData);
      setMessage(data.message || 'Registration successful');
      onRegistered(formData.email);
      setFormData({ name: '', email: '', password: '' });
    } catch (err) {
      setError(err.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-form">
      <h1>Register</h1>

      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="name"
          placeholder="Enter your name"
          value={formData.name}
          onChange={handleChange}
          required
        />

        <input
          type="email"
          name="email"
          placeholder="Enter your email"
          value={formData.email}
          onChange={handleChange}
          required
        />

        <input
          type="password"
          name="password"
          placeholder="Enter your password"
          value={formData.password}
          onChange={handleChange}
          required
        />

        <button type="submit" disabled={loading}>
          {loading ? 'Registering...' : 'Register'}
        </button>
      </form>

      {error ? <p>{error}</p> : null}
      {message ? <p>{message}</p> : null}

      <p className="auth-switch-text">
        Already have an account?{' '}
        <button className="auth-link-button" type="button" onClick={onSwitchToLogin}>
          Login
        </button>
      </p>
    </div>
  );
}

export default Register;
