import './Login.css';
import { useState } from 'react';
import axios from 'axios';
import {Header} from '../components/Header'
export function Login() {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post('http://localhost:3000/api/login', formData);

      alert('Login successful!');
      console.log('User:', response.data.user);
      console.log('Token:', response.data.token);

    
      localStorage.setItem('token', response.data.token);

    
      window.location.href = '/';

    } catch (err) {
      if (err.response?.data?.message) {
        alert(err.response.data.message);
      } else {
        alert('Login failed.');
        console.error(err);
      }
    }
  };

  return (
    <>  <Header />
    <div className="auth-page">
      <div className="wrapper">
        <div className="form-header">
          <div className="titles">
            <div className="title-login">Login</div>
          </div>
        </div>

        <form className="login-form" autoComplete="off" onSubmit={handleSubmit}>
          <div className="input-box">
            <input
              type="text"
              className="input-field"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
            <label htmlFor="log-email" className="label">Email</label>
            <i className='bx bx-envelope icon'></i>
          </div>
          <div className="input-box">
            <input
              type="password"
              className="input-field"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
            />
            <label htmlFor="log-pass" className="label">Password</label>
            <i className='bx bx-lock-alt icon'></i>
          </div>
          <div className="form-cols">
            <div className="col-1"></div>
            <div className="col-2">
              <a href="#">Forgot password?</a>
            </div>
          </div>
          <div className="input-box">
            <button className="btn-submit" id="SignInBtn" type="submit">
              Sign In <i className='bx bx-log-in'></i>
            </button>
          </div>
          <div className="switch-form">
            <span>Don't have an account? <a href="/register">Register</a></span>
          </div>
        </form>
      </div>
    </div></>
  );
}
