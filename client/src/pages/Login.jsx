import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AuthContext from '../context/AuthContext';
import toast from 'react-hot-toast';
import axios from 'axios';

const Login = () => {
  const [email, setEmail] = useState('dilip@gmail.com');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { setUser } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!email || !password) {
      toast.error('Please fill all fields');
      return;
    }

    setLoading(true);
    
    try {
      // ✅ FIXED: Use environment variable
      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
      const response = await axios.post(`${API_URL}/auth/login`, {
        email,
        password
      });
      
      console.log('Login response:', response.data);
      
      localStorage.setItem('token', response.data.token);
      setUser(response.data.user);
      toast.success('Login successful!');
      
      if (response.data.user.role === 'admin') {
        navigate('/admin');
      } else {
        navigate('/voter');
      }
      
    } catch (error) {
      console.error('Login error:', error);
      toast.error(error.response?.data?.msg || 'Login failed');
    } finally {
      setLoading(false);
    }
  };
// import React, { useState, useContext } from 'react';
// import { Link, useNavigate } from 'react-router-dom';
// import AuthContext from '../context/AuthContext';
// import toast from 'react-hot-toast';
// import axios from 'axios';  // ✅ Import axios

// const Login = () => {
//   const [email, setEmail] = useState('dilip@gmail.com');
//   const [password, setPassword] = useState('');
//   const [loading, setLoading] = useState(false);
  
//   const { setUser } = useContext(AuthContext);
//   const navigate = useNavigate();

//   const handleSubmit = async (e) => {
//     e.preventDefault();
    
//     if (!email || !password) {
//       toast.error('Please fill all fields');
//       return;
//     }

//     setLoading(true);
    
//     try {
//       // ✅ REAL API CALL - Backend se authenticate hoga
//       const response = await axios.post('http://localhost:5000/api/auth/login', {
//         email,
//         password
//       });
      
//       console.log('Login response:', response.data);
      
//       // ✅ Real token save karo
//       localStorage.setItem('token', response.data.token);
      
//       // ✅ Real user set karo
//       setUser(response.data.user);
      
//       toast.success('Login successful!');
      
//       // Redirect based on role
//       if (response.data.user.role === 'admin') {
//         navigate('/admin');
//       } else {
//         navigate('/voter');
//       }
      
//     } catch (error) {
//       console.error('Login error:', error);
//       toast.error(error.response?.data?.msg || 'Login failed');
//     } finally {
//       setLoading(false);
//     }
//   };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-blue-100 py-12 px-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-2xl p-8">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-800">Welcome Back!</h2>
          <p className="text-gray-600 mt-2">Login to your account</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-gray-700 mb-2">Email Address</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter your email"
              required
            />
          </div>

          <div>
            <label className="block text-gray-700 mb-2">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter your password"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition font-semibold"
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>

        <p className="text-center mt-6 text-gray-600">
          Don't have an account?{' '}
          <Link to="/register" className="text-blue-600 hover:underline font-semibold">
            Register here
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;