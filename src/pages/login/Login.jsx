import React, { useState } from 'react';
import { login } from '../../Services/userApi';
import './login.scss';
import { useNavigate } from 'react-router-dom';
import logo from '../../assets/logo1.png';
import logo1 from '../../assets/opal2.png';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await login(username, password);
      console.log('API Response:', response);

      if (response && response.userInfo) {
        const { role, token } = response.userInfo;
        console.log('User Role:', role);

        localStorage.setItem('token', token);
        localStorage.setItem('role', role);

        if (role === 'Admin') {
          console.log('Navigating to home page...');
          window.location.href = '/';
        } else {
          setError('You do not have access to this page.');
        }
      } else {
        setError('Invalid response from server.');
      }
    } catch (error) {
      console.error('Login Error:', error);
      setError('Login failed. Please check your credentials.');
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-image">
          <img src={logo} alt="Logo" className="logo" />
          <img src={logo1} alt="Opal" className="logo1" />
        </div>
        <form className="login-form" onSubmit={handleLogin}>
          <h2>Login</h2>
          <label>Email</label>
          <input
            type="text"
            placeholder="Please input your email!!!"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
          <label>Password</label>
          <input
            type="password"
            placeholder="Please input your password!!!"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          {error && <p className="error">{error}</p>}
          <button type="submit">Login</button>
        </form>
      </div>
    </div>
  );
};

export default Login;