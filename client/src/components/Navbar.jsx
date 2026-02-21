import React, { useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AuthContext from '../context/AuthContext';
import { 
  FaVoteYea, 
  FaUser, 
  FaSignOutAlt, 
  FaSignInAlt, 
  FaHome,
  FaChartBar,
  FaUserPlus,
  FaBars,
  FaTimes
} from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleLogoClick = () => {
    if (user) {
      if (user.role === 'admin') {
        navigate('/admin');
      } else {
        navigate('/voter');
      }
    } else {
      navigate('/');
    }
  };

  return (
    <motion.nav 
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className="bg-gradient-to-r from-primary-700 to-primary-900 shadow-2xl sticky top-0 z-50"
    >
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-20">
          {/* Logo - Clickable to Dashboard */}
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="cursor-pointer"
            onClick={handleLogoClick}
          >
            <div className="flex items-center space-x-3">
              <div className="bg-white p-2 rounded-lg shadow-lg">
                <FaVoteYea className="text-primary-600 text-2xl" />
              </div>
              <div>
                <span className="text-xl font-bold text-white block">
                  Blockchain Based Secure e-voting System
                </span>
                <span className="text-xs text-primary-200">
                  Secure • Transparent • Digital
                </span>
              </div>
            </div>
          </motion.div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            {user ? (
              <>
                {/* Dashboard Link based on role */}
                <Link 
                  to={user.role === 'admin' ? '/admin' : '/voter'}
                  className="text-white hover:text-primary-200 transition flex items-center space-x-1 group"
                >
                  <FaHome className="group-hover:scale-110 transition" />
                  <span>Dashboard</span>
                </Link>

                {/* Results Link */}
                <Link 
                  to="/results"
                  className="text-white hover:text-primary-200 transition flex items-center space-x-1 group"
                >
                  <FaChartBar className="group-hover:scale-110 transition" />
                  <span>Results</span>
                </Link>

                {/* Welcome Message with Animation */}
                <motion.div
                  initial={{ scale: 1 }}
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="bg-white/10 px-4 py-2 rounded-full"
                >
                  <span className="text-white">
                    Welcome, <span className="font-bold">{user.name}</span>
                  </span>
                </motion.div>
                
                {/* Profile Link */}
                <Link 
                  to="/profile" 
                  className="text-white hover:text-primary-200 transition flex items-center space-x-1 group"
                >
                  <div className="bg-white/20 p-2 rounded-full group-hover:bg-white/30 transition">
                    <FaUser />
                  </div>
                </Link>
                
                {/* Logout Button */}
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleLogout}
                  className="bg-red-500 hover:bg-red-600 text-white px-5 py-2.5 rounded-xl flex items-center space-x-2 shadow-lg hover:shadow-xl transition-all"
                >
                  <FaSignOutAlt />
                  <span>Logout</span>
                </motion.button>
              </>
            ) : (
              <>
                <Link 
                  to="/login" 
                  className="text-white hover:text-primary-200 transition flex items-center space-x-2 group"
                >
                  <FaSignInAlt className="group-hover:translate-x-1 transition" />
                  <span>Login</span>
                </Link>
                <Link 
                  to="/register" 
                  className="bg-white text-primary-700 px-6 py-2.5 rounded-xl hover:bg-primary-50 transition flex items-center space-x-2 shadow-lg hover:shadow-xl"
                >
                  <FaUserPlus />
                  <span>Register</span>
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-white p-2 hover:bg-white/10 rounded-lg transition"
            >
              {isMenuOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden pb-4"
            >
              <div className="bg-white/10 backdrop-blur-lg rounded-xl p-4 space-y-3">
                {user ? (
                  <>
                    <Link 
                      to={user.role === 'admin' ? '/admin' : '/voter'}
                      className="block text-white hover:bg-white/10 px-4 py-3 rounded-lg transition"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <FaHome className="inline mr-2" /> Dashboard
                    </Link>
                    <Link 
                      to="/results"
                      className="block text-white hover:bg-white/10 px-4 py-3 rounded-lg transition"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <FaChartBar className="inline mr-2" /> Results
                    </Link>
                    <Link 
                      to="/profile"
                      className="block text-white hover:bg-white/10 px-4 py-3 rounded-lg transition"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <FaUser className="inline mr-2" /> Profile
                    </Link>
                    <button
                      onClick={() => {
                        handleLogout();
                        setIsMenuOpen(false);
                      }}
                      className="w-full text-left bg-red-500 hover:bg-red-600 text-white px-4 py-3 rounded-lg transition"
                    >
                      <FaSignOutAlt className="inline mr-2" /> Logout
                    </button>
                  </>
                ) : (
                  <>
                    <Link 
                      to="/login"
                      className="block text-white hover:bg-white/10 px-4 py-3 rounded-lg transition"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <FaSignInAlt className="inline mr-2" /> Login
                    </Link>
                    <Link 
                      to="/register"
                      className="block bg-white text-primary-700 px-4 py-3 rounded-lg transition"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <FaUserPlus className="inline mr-2" /> Register
                    </Link>
                  </>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.nav>
  );
};

export default Navbar;