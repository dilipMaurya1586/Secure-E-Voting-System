import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FaVoteYea, FaHistory, FaCheckCircle, FaClock, FaCalendarAlt,
  FaSearch, FaBell, FaUserCircle, FaSignOutAlt, FaCog,
  FaArrowRight, FaTimes, FaSyncAlt, FaChartLine // ✅ New icons
} from 'react-icons/fa';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { getElections, getVotingHistory } from '../services/api';

const VoterDashboard = () => {
  const [elections, setElections] = useState([]);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  // ✅ New states for interactivity
  const [currentTime, setCurrentTime] = useState(new Date());
  const [searchTerm, setSearchTerm] = useState('');
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchData();
    // ✅ Live clock
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const fetchData = async () => {
    try {
      const [electionsRes, historyRes] = await Promise.all([
        getElections(),
        getVotingHistory()
      ]);
      setElections(electionsRes.data);
      setHistory(historyRes.data);
    } catch (error) {
      toast.error('Failed to fetch data');
    } finally {
      setLoading(false);
    }
  };

  // ✅ Refresh function
  const handleRefresh = () => {
    setLoading(true);
    fetchData();
    toast.success('Dashboard refreshed! 🔄');
  };

  // ✅ Search function
  const filteredElections = elections.filter(election => 
    election.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    election.description?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Group elections by status
  const ongoingElections = filteredElections.filter(e => e.status === 'ongoing');
  const upcomingElections = filteredElections.filter(e => e.status === 'upcoming');
  const completedElections = filteredElections.filter(e => e.status === 'completed');

  // ✅ Notifications data
  const notifications = [
    { id: 1, message: "Election 'Lok Sabha' ends tomorrow", time: "1 hour ago", type: "warning" },
    { id: 2, message: "You haven't voted in 3 elections", time: "2 hours ago", type: "info" },
    { id: 3, message: "New results available", time: "5 hours ago", type: "success" },
  ];

  const stats = [
    { 
      label: 'Total Elections', 
      value: elections.length, 
      icon: FaVoteYea, 
      color: 'bg-blue-500' 
    },
    { 
      label: 'Voted', 
      value: history.length, 
      icon: FaCheckCircle, 
      color: 'bg-green-500' 
    },
    { 
      label: 'History', 
      value: history.length > 0 ? 'View' : 'No votes', 
      icon: FaHistory, 
      color: 'bg-purple-500',
      link: '/history' 
    },
  ];

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8">
      <div className="container mx-auto px-4 max-w-7xl">
        {/* ===== ENHANCED HEADER SECTION ===== */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-xl p-6 border border-white/20">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
              {/* Left Section - Welcome */}
              <div className="flex items-center gap-4">
                {/* <motion.div
                  animate={{ rotate: [0, 10, -10, 0] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="p-3 bg-primary-100 rounded-xl"
                >
                  <FaVoteYea className="text-3xl text-primary-600" />
                </motion.div> */}
                <div>
                  <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                    👤 Welcome Back, Voter! 👋
                    <span className="text-sm bg-green-100 text-green-600 px-2 py-1 rounded-full">
                      ✅ Verified
                    </span>
                  </h1>
                  <p className="text-gray-600 flex items-center gap-2">
                    Your vote is your superpower
                    <span className="text-xs bg-primary-100 px-2 py-1 rounded-full text-primary-600">
                      {currentTime.toLocaleDateString()} • {currentTime.toLocaleTimeString()}
                    </span>
                  </p>
                </div>
              </div>

              {/* Right Section - Actions */}
              <div className="flex items-center gap-3">
                {/* Search Bar */}
                <div className="relative hidden md:block">
                  <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search elections..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 w-64"
                  />
                  {searchTerm && (
                    <button
                      onClick={() => setSearchTerm('')}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      <FaTimes />
                    </button>
                  )}
                </div>

                {/* Refresh Button */}
                <motion.button
                  whileHover={{ rotate: 180 }}
                  transition={{ duration: 0.3 }}
                  onClick={handleRefresh}
                  className="p-2 bg-white rounded-lg shadow-md hover:shadow-lg transition text-primary-600"
                  title="Refresh"
                >
                  <FaSyncAlt />
                </motion.button>

                {/* Notifications */}
                <div className="relative">
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setShowNotifications(!showNotifications)}
                    className="p-2 bg-white rounded-lg shadow-md hover:shadow-lg transition relative"
                  >
                    <FaBell className="text-xl text-gray-600" />
                    <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                      3
                    </span>
                  </motion.button>

                  <AnimatePresence>
                    {showNotifications && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-2xl border border-gray-100 z-50"
                      >
                        <div className="p-4 border-b flex justify-between items-center bg-gradient-to-r from-primary-600 to-primary-800 text-white rounded-t-xl">
                          <h3 className="font-semibold">Notifications</h3>
                          <button onClick={() => setShowNotifications(false)}>
                            <FaTimes />
                          </button>
                        </div>
                        <div className="p-2">
                          {notifications.map(notif => (
                            <div key={notif.id} className="p-3 hover:bg-gray-50 rounded-lg cursor-pointer transition">
                              <p className="text-sm">{notif.message}</p>
                              <p className="text-xs text-gray-400 mt-1">{notif.time}</p>
                            </div>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Profile Menu */}
                <div className="relative">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    onClick={() => setShowProfileMenu(!showProfileMenu)}
                    className="flex items-center gap-2 p-2 bg-white rounded-lg shadow-md hover:shadow-lg transition"
                  >
                    <FaUserCircle className="text-2xl text-primary-600" />
                    <span className="hidden md:block text-sm font-medium">My Account</span>
                  </motion.button>

                  <AnimatePresence>
                    {showProfileMenu && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-2xl border border-gray-100 z-50"
                      >
                        <div className="p-2">
                          <button className="w-full p-3 text-left hover:bg-gray-50 rounded-lg flex items-center gap-2">
                            <FaUserCircle /> Profile
                          </button>
                          <button className="w-full p-3 text-left hover:bg-gray-50 rounded-lg flex items-center gap-2">
                            <FaCog /> Settings
                          </button>
                          <hr className="my-2" />
                          <button 
                            onClick={() => {
                              toast.success('Logged out!');
                              navigate('/login');
                            }}
                            className="w-full p-3 text-left hover:bg-red-50 rounded-lg flex items-center gap-2 text-red-600"
                          >
                            <FaSignOutAlt /> Logout
                          </button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            </div>

            {/* Mobile Search - Visible only on mobile */}
            {searchTerm && (
              <div className="mt-4 md:hidden">
                <div className="bg-primary-50 p-3 rounded-lg">
                  <p className="text-sm text-gray-600">
                    Found {filteredElections.length} results for "{searchTerm}"
                  </p>
                </div>
              </div>
            )}
          </div>
        </motion.div>

        {/* Stats Cards (Same as before) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ scale: 1.05, y: -5 }}
              className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-all cursor-pointer"
              onClick={() => stat.link && navigate(stat.link)}
            >
              <div className="flex items-center space-x-4">
                <div className={`${stat.color} p-3 rounded-lg`}>
                  <stat.icon className="text-white text-2xl" />
                </div>
                <div className="flex-1">
                  <p className="text-gray-600">{stat.label}</p>
                  <p className="text-2xl font-bold">{stat.value}</p>
                </div>
                {stat.link && (
                  <FaArrowRight className="text-gray-400 group-hover:text-primary-600" />
                )}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Search Results Summary */}
        {searchTerm && filteredElections.length === 0 && (
          <div className="mb-8 p-8 bg-white rounded-xl shadow-lg text-center">
            <p className="text-gray-500">No elections found matching "{searchTerm}"</p>
          </div>
        )}

        {/* Live Stats Bar */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl p-4 text-white">
            <FaChartLine className="text-2xl mb-2" />
            <p className="text-sm opacity-90">Live Elections</p>
            <p className="text-2xl font-bold">{ongoingElections.length}</p>
          </div>
          <div className="bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-xl p-4 text-white">
            <FaClock className="text-2xl mb-2" />
            <p className="text-sm opacity-90">Upcoming</p>
            <p className="text-2xl font-bold">{upcomingElections.length}</p>
          </div>
          <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl p-4 text-white">
            <FaCheckCircle className="text-2xl mb-2" />
            <p className="text-sm opacity-90">Completed</p>
            <p className="text-2xl font-bold">{completedElections.length}</p>
          </div>
        </div>

        {/* Voting History Section (Exactly as you had it) */}
        {history.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-2xl font-bold mb-6 flex items-center">
                <FaHistory className="text-primary-600 mr-3" /> 
                Your Voting History
              </h2>
              
              <div className="space-y-4">
                {history.map((vote, index) => (
                  <motion.div
                    key={vote._id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    whileHover={{ scale: 1.02, x: 10 }}
                    className="border-l-4 border-green-500 bg-green-50 p-4 rounded-r-lg cursor-pointer"
                    onClick={() => toast.success(`Vote details for ${vote.electionId?.title}`)}
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-semibold text-lg">
                          {vote.electionId?.title || 'Election'}
                        </h3>
                        <p className="text-gray-600">
                          Voted for: <span className="font-medium text-green-600">
                            {vote.candidateId?.name || 'Candidate'}
                          </span>
                          {vote.candidateId?.party && (
                            <span className="text-gray-500"> ({vote.candidateId.party})</span>
                          )}
                        </p>
                      </div>
                      <div className="text-right">
                        <div className="flex items-center text-gray-500 text-sm">
                          <FaCalendarAlt className="mr-1" />
                          {new Date(vote.timestamp).toLocaleDateString()}
                        </div>
                        <div className="flex items-center text-gray-500 text-sm mt-1">
                          <FaClock className="mr-1" />
                          {new Date(vote.timestamp).toLocaleTimeString()}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {/* Ongoing Elections (Same as before) */}
        {ongoingElections.length > 0 && (
          <div className="mb-8">
            <h2 className="text-2xl font-bold mb-6 text-green-600">🔴 Live Elections</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {ongoingElections.map((election, index) => (
                <motion.div
                  key={election._id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ scale: 1.05, y: -5 }}
                  className="card hover:border-green-500 border-2 border-green-200 cursor-pointer"
                  onClick={() => navigate(`/vote/${election._id}`)}
                >
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="text-xl font-semibold">{election.title}</h3>
                    <span className="px-3 py-1 bg-green-100 text-green-600 rounded-full text-sm flex items-center gap-1">
                      <span className="w-2 h-2 bg-green-600 rounded-full animate-pulse"></span>
                      LIVE
                    </span>
                  </div>
                  <p className="text-gray-600 mb-4">{election.description}</p>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-500">
                      Ends: {new Date(election.endDate).toLocaleDateString()}
                    </span>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="btn-primary !py-2 !px-4"
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate(`/vote/${election._id}`);
                      }}
                    >
                      Vote Now
                    </motion.button>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        )}

        {/* Upcoming Elections (Same as before) */}
        {upcomingElections.length > 0 && (
          <div className="mb-8">
            <h2 className="text-2xl font-bold mb-6 text-yellow-600">⏳ Upcoming Elections</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {upcomingElections.map((election, index) => (
                <motion.div
                  key={election._id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ scale: 1.05 }}
                  className="card hover:border-yellow-500"
                >
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="text-xl font-semibold">{election.title}</h3>
                    <span className="px-3 py-1 bg-yellow-100 text-yellow-600 rounded-full text-sm">
                      Upcoming
                    </span>
                  </div>
                  <p className="text-gray-600 mb-4">{election.description}</p>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-500">
                      Starts: {new Date(election.startDate).toLocaleDateString()}
                    </span>
                    <span className="text-sm font-medium text-yellow-600">
                      {Math.ceil((new Date(election.startDate) - new Date()) / (1000 * 60 * 60 * 24))} days left
                    </span>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        )}

        {/* Completed Elections (Same as before) */}
        {completedElections.length > 0 && (
          <div className="mb-8">
            <h2 className="text-2xl font-bold mb-6 text-gray-600">✅ Completed Elections</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {completedElections.slice(0, 3).map((election, index) => (
                <motion.div
                  key={election._id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ scale: 1.05 }}
                  className="card bg-gray-50 cursor-pointer"
                  onClick={() => navigate(`/results/${election._id}`)}
                >
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="text-xl font-semibold">{election.title}</h3>
                    <span className="px-3 py-1 bg-gray-200 text-gray-600 rounded-full text-sm">
                      Completed
                    </span>
                  </div>
                  <p className="text-gray-600 mb-4">{election.description}</p>
                  <button className="w-full bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition">
                    View Results
                  </button>
                </motion.div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default VoterDashboard;






