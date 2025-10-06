import './Register.css';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom'; 
import {Header} from '../components/Header';
import axios from 'axios';

export function Register() {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    phone: '',
    password: '',
    address: '',
  });

  const navigate = useNavigate(); 

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post('http://localhost:3000/api/register', {
        ...formData,
        role: 'client' 
      });

      alert('Registration successful!');
      console.log('User:', response.data.user);
      console.log('Token:', response.data.token);

      
      navigate('/login');

    } catch (err) {
      if (err.response?.data?.message) {
        alert(err.response.data.message);
      } else {
        alert('Registration failed.');
        console.error(err);
      }
    }
  };

  return (
    <>  <Header />
    <div className="register-page">
      <div className="wrapper">
        <div className="form-header">
          <div className="titles">
            <div className="title-register">Register</div>
          </div>
        </div>

        <form className="register-form" autoComplete="off" onSubmit={handleSubmit}>
          <div className="input-box">
            <input
              type="text"
              className="input-field"
              name="username"
              value={formData.username}
              onChange={handleChange}
              required
            />
            <label htmlFor="reg-name" className="label">Username</label>
            <i className="bx bx-user icon"></i>
          </div>

          <div className="input-box">
            <input
              type="email"
              className="input-field"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
            <label htmlFor="reg-email" className="label">Email</label>
            <i className="bx bx-envelope icon"></i>
          </div>

          <div className="input-box">
            <input
              type="text"
              className="input-field"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              required
            />
            <label htmlFor="reg-phone" className="label">Phone No</label>
            <i className="bx bx-user icon"></i>
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
            <label htmlFor="reg-pass" className="label">Password</label>
            <i className="bx bx-lock-alt icon"></i>
          </div>

          <div className="input-box">
            <input
              type="text"
              className="input-field"
              name="address"
              value={formData.address}
              onChange={handleChange}
              required
            />
            <label htmlFor="reg-address" className="label">Address</label>
            <i className="bx bx-user icon"></i>
          </div>

          <div className="form-cols">
            <div className="col-1">
              <input type="checkbox" id="agree" required />
              <label htmlFor="agree"> I agree to terms & conditions</label>
            </div>
            <div className="col-2"></div>
          </div>

          <div className="input-box">
            <button className="btn-submit" id="SignUpBtn" type="submit">
              Sign Up <i className="bx bx-user-plus"></i>
            </button>
          </div>

          <div className="switch-form">
            <span>Already have an account? <a href="/login">Login</a></span>
          </div>
        </form>
      </div>
    </div></>
  );
}
