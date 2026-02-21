import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FaVoteYea, FaUsers, FaCheckCircle, FaPlusCircle, FaCrown,
  FaChartBar, FaCalendarAlt, FaClock, FaUserCheck, FaUserTimes,
  FaPoll, FaFlag, FaSearch, FaFilter, FaDownload, FaEllipsisV,
  FaEye, FaEdit, FaTrash, FaChartPie, FaRegBell, FaUserPlus,
  FaSyncAlt, FaTimes // ✅ 1. Naye icons add kiye
} from 'react-icons/fa';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { getElections, getVoters } from '../services/api';

const AdminDashboard = () => {
  const [elections, setElections] = useState([]);
  const [voters, setVoters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedPeriod, setSelectedPeriod] = useState('week');
  const [searchTerm, setSearchTerm] = useState('');
  const [hoveredCard, setHoveredCard] = useState(null);
  const [showNotifications, setShowNotifications] = useState(false);
  // ✅ 2. Live clock ke liye state add ki
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    fetchData();
    // ✅ 3. Live clock interval add kiya
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // ✅ 4. Refresh function add kiya
  const handleRefresh = () => {
    setLoading(true);
    fetchData();
    toast.success('Dashboard refreshed! 🔄');
  };

  // ✅ 5. Search clear function add kiya
  const clearSearch = () => {
    setSearchTerm('');
    toast.success('Search cleared');
  };

  const fetchData = async () => {
    try {
      const [electionsRes, votersRes] = await Promise.all([
        getElections(),
        getVoters()
      ]);
      setElections(electionsRes.data);
      setVoters(votersRes.data);
    } catch (error) {
      toast.error('Failed to fetch data');
    } finally {
      setLoading(false);
    }
  };

  // Calculate statistics
  const totalVoters = voters.length;
  const verifiedVoters = voters.filter(v => v.isVerified).length;
  const pendingVoters = totalVoters - verifiedVoters;
  
  const ongoingElections = elections.filter(e => e.status === 'ongoing').length;
  const upcomingElections = elections.filter(e => e.status === 'upcoming').length;
  const completedElections = elections.filter(e => e.status === 'completed').length;

  const stats = [
    { 
      label: 'Total Elections', 
      value: elections.length,
      subValue: `${ongoingElections} ongoing`,
      icon: FaPoll, 
      color: 'from-blue-600 to-blue-400',
      bgColor: 'bg-blue-50',
      textColor: 'text-blue-600',
      trend: '+12%'
    },
    { 
      label: 'Total Voters', 
      value: totalVoters,
      subValue: `${verifiedVoters} verified`,
      icon: FaUsers, 
      color: 'from-green-600 to-green-400',
      bgColor: 'bg-green-50',
      textColor: 'text-green-600',
      trend: '+8%'
    },
    { 
      label: 'Verified Voters', 
      value: verifiedVoters,
      subValue: `${pendingVoters} pending`,
      icon: FaCheckCircle, 
      color: 'from-purple-600 to-purple-400',
      bgColor: 'bg-purple-50',
      textColor: 'text-purple-600',
      trend: '+15%'
    },
    { 
      label: 'Voter Turnout', 
      value: totalVoters ? Math.round((verifiedVoters / totalVoters) * 100) : 0,
      subValue: 'completion rate',
      icon: FaChartPie, 
      color: 'from-yellow-600 to-yellow-400',
      bgColor: 'bg-yellow-50',
      textColor: 'text-yellow-600',
      suffix: '%'
    },
  ];

  const quickActions = [
    { to: "/admin/create-election", icon: FaPlusCircle, label: "Create Election", color: "blue", description: "Start new election" },
    { to: "/admin/candidates", icon: FaUserPlus, label: "Add Candidate", color: "green", description: "Manage candidates" },
    { to: "/admin/voters", icon: FaUserCheck, label: "Verify Voters", color: "purple", description: "Approve new voters" },
    { to: "/admin/results", icon: FaChartBar, label: "View Results", color: "yellow", description: "See election results" },
  ];

  const notifications = [
    { id: 1, message: "5 new voters registered", time: "5 min ago", type: "info" },
    { id: 2, message: "Election 'Lok Sabha 2024' ends tomorrow", time: "1 hour ago", type: "warning" },
    { id: 3, message: "3 candidates added to Election 2026", time: "2 hours ago", type: "success" },
  ];

  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center bg-gradient-to-br from-purple-50 to-purple-100">
        <div className="text-center">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            className="w-20 h-20 border-4 border-purple-200 border-t-purple-600 rounded-full mx-auto mb-4"
          />
          <p className="text-gray-600 animate-pulse">Loading admin dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8">
      <div className="container mx-auto px-4 max-w-7xl">
        {/* Header with Glass Effect */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-xl p-8 border border-white/20">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-3">
                  {/* <motion.div
                    animate={{ rotate: [0, 10, -10, 0] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="p-3 bg-purple-100 rounded-xl"
                  >
                    <FaCrown className="text-3xl text-purple-600" />
                  </motion.div> */}
                  <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-purple-800 bg-clip-text text-transparent">
                  🏛️ Your Voice, Your Power!
                  </h1>
                </div>
                <p className="text-gray-600 text-lg flex items-center gap-4">
                  Welcome back! Every vote shapes the future.
                
                  {/* ✅ 6. Live clock display add kiya */}
                  <span className="text-sm bg-purple-100 px-3 py-1 rounded-full text-purple-600">
                    {currentTime.toLocaleDateString()} • {currentTime.toLocaleTimeString()}
                  </span>
                </p>

              </div>

              {/* Right Section - Search & Notifications */}
              <div className="flex items-center gap-4">
                {/* Search Bar with Clear Button */}
                <div className="relative">
                  <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Quick search..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 pr-10 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 w-64"
                  />
                  {searchTerm && (
                    <button
                      onClick={clearSearch}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      <FaTimes />
                    </button>
                  )}
                </div>

                {/* Refresh Button - NEW */}
                <motion.button
                  whileHover={{ rotate: 180 }}
                  transition={{ duration: 0.3 }}
                  onClick={handleRefresh}
                  className="p-2 bg-white rounded-lg shadow-md hover:shadow-lg transition text-purple-600"
                  title="Refresh Dashboard"
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
                    <FaRegBell className="text-xl text-gray-600" />
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
                        <div className="p-4 border-b flex justify-between items-center">
                          <h3 className="font-semibold">Notifications</h3>
                          <button onClick={() => setShowNotifications(false)}>
                            <FaTimes className="text-gray-400" />
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

                {/* Export Button */}
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition"
                  onClick={() => toast.success('Export started! 📥')}
                >
                  <FaDownload /> Export Report
                </motion.button>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Rest of your code remains EXACTLY the same */}
        {/* Stats Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              onHoverStart={() => setHoveredCard(index)}
              onHoverEnd={() => setHoveredCard(null)}
              className="bg-white rounded-xl shadow-lg hover:shadow-2xl transition-all overflow-hidden"
            >
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className={`p-3 rounded-xl bg-gradient-to-br ${stat.color} text-white`}>
                    <stat.icon className="text-2xl" />
                  </div>
                  <motion.span
                    animate={{ scale: hoveredCard === index ? 1.1 : 1 }}
                    className="text-sm text-green-600 bg-green-50 px-2 py-1 rounded-full"
                  >
                    {stat.trend}
                  </motion.span>
                </div>
                <p className="text-gray-600 text-sm mb-1">{stat.label}</p>
                <p className="text-3xl font-bold text-gray-800 mb-2">
                  {stat.value}{stat.suffix || ''}
                </p>
                <p className="text-sm text-gray-500">{stat.subValue}</p>
              </div>
              
              {/* Progress Bar */}
              <motion.div 
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ delay: index * 0.1 + 0.5 }}
                className="h-1 bg-gray-100 origin-left"
              >
                <motion.div 
                  className={`h-full bg-gradient-to-r ${stat.color}`}
                  initial={{ width: 0 }}
                  animate={{ width: `${Math.min((stat.value / 100) * 100, 100)}%` }}
                  transition={{ delay: index * 0.1 + 0.7, duration: 1 }}
                />
              </motion.div>
            </motion.div>
          ))}
        </div>

        {/* Quick Actions with Descriptions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mb-8"
        >
          <h2 className="text-2xl font-bold mb-6 flex items-center">
            <FaFlag className="mr-3 text-purple-600" /> Quick Actions
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {quickActions.map((action, index) => (
              <Link to={action.to} key={index}>
                <motion.div
                  whileHover={{ scale: 1.05, y: -5 }}
                  whileTap={{ scale: 0.95 }}
                  className="bg-white rounded-xl shadow-lg p-6 cursor-pointer hover:shadow-2xl transition-all relative overflow-hidden group"
                >
                  <div className={`absolute inset-0 bg-gradient-to-br from-${action.color}-50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity`} />
                  
                  <div className="relative">
                    <div className={`w-16 h-16 bg-${action.color}-100 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                      <action.icon className={`text-3xl text-${action.color}-600`} />
                    </div>
                    <h3 className={`text-xl font-bold text-${action.color}-600 mb-2`}>
                      {action.label}
                    </h3>
                    <p className="text-gray-500 text-sm">
                      {action.description}
                    </p>
                    <motion.div
                      animate={{ x: [0, 5, 0] }}
                      transition={{ duration: 2, repeat: Infinity }}
                      className={`absolute bottom-6 right-6 text-${action.color}-400 opacity-0 group-hover:opacity-100 transition-opacity`}
                    >
                      →
                    </motion.div>
                  </div>
                </motion.div>
              </Link>
            ))}
          </div>
        </motion.div>

        {/* Analytics & Recent Elections Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Election Status Cards */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            className="lg:col-span-1"
          >
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-lg font-semibold mb-4 flex items-center">
                <FaCalendarAlt className="mr-2 text-purple-600" /> Election Status
              </h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                  <div className="flex items-center">
                    <div className="w-3 h-3 bg-green-500 rounded-full mr-3 animate-pulse" />
                    <span className="font-medium">Ongoing</span>
                  </div>
                  <span className="text-2xl font-bold text-green-600">{ongoingElections}</span>
                </div>
                
                <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
                  <div className="flex items-center">
                    <div className="w-3 h-3 bg-yellow-500 rounded-full mr-3" />
                    <span className="font-medium">Upcoming</span>
                  </div>
                  <span className="text-2xl font-bold text-yellow-600">{upcomingElections}</span>
                </div>
                
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center">
                    <div className="w-3 h-3 bg-gray-500 rounded-full mr-3" />
                    <span className="font-medium">Completed</span>
                  </div>
                  <span className="text-2xl font-bold text-gray-600">{completedElections}</span>
                </div>
              </div>

              {/* Voter Verification Progress */}
              <div className="mt-6 pt-6 border-t">
                <h4 className="text-sm font-medium text-gray-600 mb-3">Voter Verification</h4>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-500">Progress</span>
                  <span className="text-sm font-medium">
                    {verifiedVoters}/{totalVoters}
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${totalVoters ? (verifiedVoters / totalVoters) * 100 : 0}%` }}
                    transition={{ duration: 1 }}
                    className="bg-purple-600 h-2.5 rounded-full"
                  />
                </div>
                <div className="flex justify-between mt-2 text-xs text-gray-500">
                  <span>✅ {verifiedVoters} Verified</span>
                  <span>⏳ {pendingVoters} Pending</span>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Recent Elections */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            className="lg:col-span-2"
          >
            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold flex items-center">
                  <FaPoll className="mr-2 text-purple-600" /> Recent Elections
                </h3>
                <Link to="/admin/elections" className="text-sm text-purple-600 hover:underline">
                  View All →
                </Link>
              </div>

              {elections.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-gray-500 mb-4">No elections created yet</p>
                  <Link to="/admin/create-election">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition"
                    >
                      Create Your First Election
                    </motion.button>
                  </Link>
                </div>
              ) : (
                <div className="space-y-4">
                  {elections.slice(0, 5).map((election, index) => (
                    <motion.div
                      key={election._id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="flex items-center justify-between p-4 hover:bg-gray-50 rounded-lg transition group"
                    >
                      <div className="flex items-center flex-1">
                        <div className={`w-2 h-2 rounded-full mr-3 ${
                          election.status === 'ongoing' ? 'bg-green-500' :
                          election.status === 'upcoming' ? 'bg-yellow-500' : 'bg-gray-500'
                        }`} />
                        <div className="flex-1">
                          <h4 className="font-medium">{election.title}</h4>
                          <p className="text-sm text-gray-500">
                            {election.description?.substring(0, 50)}...
                          </p>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition">
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          className="p-2 hover:bg-blue-100 rounded-lg text-blue-600"
                          onClick={() => toast.info(`Viewing ${election.title}`)}
                        >
                          <FaEye />
                        </motion.button>
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          className="p-2 hover:bg-green-100 rounded-lg text-green-600"
                          onClick={() => toast.success(`Editing ${election.title}`)}
                        >
                          <FaEdit />
                        </motion.button>
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          className="p-2 hover:bg-red-100 rounded-lg text-red-600"
                          onClick={() => toast.error(`Delete ${election.title}?`)}
                        >
                          <FaTrash />
                        </motion.button>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        </div>

        {/* Bottom Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8"
        >
          <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl shadow-lg p-6 text-white">
            <FaClock className="text-3xl mb-3 opacity-80" />
            <p className="text-sm opacity-90">Next Election</p>
            <p className="text-xl font-bold">Lok Sabha 2024</p>
            <p className="text-sm opacity-80 mt-2">Starts in 5 days</p>
          </div>
          
          <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl shadow-lg p-6 text-white">
            <FaUserCheck className="text-3xl mb-3 opacity-80" />
            <p className="text-sm opacity-90">Pending Verifications</p>
            <p className="text-xl font-bold">{pendingVoters} Voters</p>
            <p className="text-sm opacity-80 mt-2">Need approval</p>
          </div>
          
          <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl shadow-lg p-6 text-white">
            <FaChartBar className="text-3xl mb-3 opacity-80" />
            <p className="text-sm opacity-90">Total Votes Cast</p>
            <p className="text-xl font-bold">1,234</p>
            <p className="text-sm opacity-80 mt-2">Across all elections</p>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default AdminDashboard;




// import React, { useState, useEffect } from 'react';
// import { motion, AnimatePresence } from 'framer-motion';
// import { 
//   FaVoteYea, FaUsers, FaCheckCircle, FaPlusCircle, FaCrown,
//   FaChartBar, FaCalendarAlt, FaClock, FaUserCheck, FaUserTimes,
//   FaPoll, FaFlag, FaSearch, FaFilter, FaDownload, FaEllipsisV,
//   FaEye, FaEdit, FaTrash, FaChartPie, FaRegBell, FaUserPlus
// } from 'react-icons/fa';
// import { Link } from 'react-router-dom';
// import toast from 'react-hot-toast';
// import { getElections, getVoters } from '../services/api';

// const AdminDashboard = () => {
//   const [elections, setElections] = useState([]);
//   const [voters, setVoters] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [selectedPeriod, setSelectedPeriod] = useState('week');
//   const [searchTerm, setSearchTerm] = useState('');
//   const [hoveredCard, setHoveredCard] = useState(null);
//   const [showNotifications, setShowNotifications] = useState(false);

//   useEffect(() => {
//     fetchData();
//   }, []);

//   const fetchData = async () => {
//     try {
//       const [electionsRes, votersRes] = await Promise.all([
//         getElections(),
//         getVoters()
//       ]);
//       setElections(electionsRes.data);
//       setVoters(votersRes.data);
//     } catch (error) {
//       toast.error('Failed to fetch data');
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Calculate statistics
//   const totalVoters = voters.length;
//   const verifiedVoters = voters.filter(v => v.isVerified).length;
//   const pendingVoters = totalVoters - verifiedVoters;
  
//   const ongoingElections = elections.filter(e => e.status === 'ongoing').length;
//   const upcomingElections = elections.filter(e => e.status === 'upcoming').length;
//   const completedElections = elections.filter(e => e.status === 'completed').length;

//   const stats = [
//     { 
//       label: 'Total Elections', 
//       value: elections.length,
//       subValue: `${ongoingElections} ongoing`,
//       icon: FaPoll, 
//       color: 'from-blue-600 to-blue-400',
//       bgColor: 'bg-blue-50',
//       textColor: 'text-blue-600',
//       trend: '+12%'
//     },
//     { 
//       label: 'Total Voters', 
//       value: totalVoters,
//       subValue: `${verifiedVoters} verified`,
//       icon: FaUsers, 
//       color: 'from-green-600 to-green-400',
//       bgColor: 'bg-green-50',
//       textColor: 'text-green-600',
//       trend: '+8%'
//     },
//     { 
//       label: 'Verified Voters', 
//       value: verifiedVoters,
//       subValue: `${pendingVoters} pending`,
//       icon: FaCheckCircle, 
//       color: 'from-purple-600 to-purple-400',
//       bgColor: 'bg-purple-50',
//       textColor: 'text-purple-600',
//       trend: '+15%'
//     },
//     { 
//       label: 'Voter Turnout', 
//       value: totalVoters ? Math.round((verifiedVoters / totalVoters) * 100) : 0,
//       subValue: 'completion rate',
//       icon: FaChartPie, 
//       color: 'from-yellow-600 to-yellow-400',
//       bgColor: 'bg-yellow-50',
//       textColor: 'text-yellow-600',
//       suffix: '%'
//     },
//   ];

//   const quickActions = [
//     { to: "/admin/create-election", icon: FaPlusCircle, label: "Create Election", color: "blue", description: "Start new election" },
//     { to: "/admin/candidates", icon: FaUserPlus, label: "Add Candidate", color: "green", description: "Manage candidates" },
//     { to: "/admin/voters", icon: FaUserCheck, label: "Verify Voters", color: "purple", description: "Approve new voters" },
//     { to: "/admin/results", icon: FaChartBar, label: "View Results", color: "yellow", description: "See election results" },
//   ];

//   const notifications = [
//     { id: 1, message: "5 new voters registered", time: "5 min ago", type: "info" },
//     { id: 2, message: "Election 'Lok Sabha 2024' ends tomorrow", time: "1 hour ago", type: "warning" },
//     { id: 3, message: "3 candidates added to Election 2026", time: "2 hours ago", type: "success" },
//   ];

//   if (loading) {
//     return (
//       <div className="min-h-screen flex justify-center items-center bg-gradient-to-br from-purple-50 to-purple-100">
//         <div className="text-center">
//           <motion.div
//             animate={{ rotate: 360 }}
//             transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
//             className="w-20 h-20 border-4 border-purple-200 border-t-purple-600 rounded-full mx-auto mb-4"
//           />
//           <p className="text-gray-600 animate-pulse">Loading admin dashboard...</p>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8">
//       <div className="container mx-auto px-4 max-w-7xl">
//         {/* Header with Glass Effect */}
//         <motion.div
//           initial={{ opacity: 0, y: -20 }}
//           animate={{ opacity: 1, y: 0 }}
//           className="mb-8"
//         >
//           <div className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-xl p-8 border border-white/20">
//             <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
//               <div className="flex-1">
//                 <div className="flex items-center gap-3 mb-3">
//                   <motion.div
//                     animate={{ rotate: [0, 10, -10, 0] }}
//                     transition={{ duration: 2, repeat: Infinity }}
//                     className="p-3 bg-purple-100 rounded-xl"
//                   >
//                     <FaCrown className="text-3xl text-purple-600" />
//                   </motion.div>
//                   <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-purple-800 bg-clip-text text-transparent">
//                     Blockchain Based Secure e-voting System
//                   </h1>
//                 </div>
//                 <p className="text-gray-600 text-lg">
//                   Welcome back! Manage elections, candidates and voters from one place.
//                 </p>
//               </div>

//               {/* Right Section - Search & Notifications */}
//               <div className="flex items-center gap-4">
//                 {/* Search Bar */}
//                 <div className="relative">
//                   <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
//                   <input
//                     type="text"
//                     placeholder="Quick search..."
//                     value={searchTerm}
//                     onChange={(e) => setSearchTerm(e.target.value)}
//                     className="pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 w-64"
//                   />
//                 </div>

//                 {/* Notifications */}
//                 <div className="relative">
//                   <motion.button
//                     whileHover={{ scale: 1.1 }}
//                     whileTap={{ scale: 0.9 }}
//                     onClick={() => setShowNotifications(!showNotifications)}
//                     className="p-2 bg-white rounded-lg shadow-md hover:shadow-lg transition relative"
//                   >
//                     <FaRegBell className="text-xl text-gray-600" />
//                     <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
//                       3
//                     </span>
//                   </motion.button>

//                   <AnimatePresence>
//                     {showNotifications && (
//                       <motion.div
//                         initial={{ opacity: 0, y: 10 }}
//                         animate={{ opacity: 1, y: 0 }}
//                         exit={{ opacity: 0, y: 10 }}
//                         className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-2xl border border-gray-100 z-50"
//                       >
//                         <div className="p-4 border-b">
//                           <h3 className="font-semibold">Notifications</h3>
//                         </div>
//                         <div className="p-2">
//                           {notifications.map(notif => (
//                             <div key={notif.id} className="p-3 hover:bg-gray-50 rounded-lg cursor-pointer transition">
//                               <p className="text-sm">{notif.message}</p>
//                               <p className="text-xs text-gray-400 mt-1">{notif.time}</p>
//                             </div>
//                           ))}
//                         </div>
//                       </motion.div>
//                     )}
//                   </AnimatePresence>
//                 </div>

//                 {/* Export Button */}
//                 <motion.button
//                   whileHover={{ scale: 1.05 }}
//                   whileTap={{ scale: 0.95 }}
//                   className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition"
//                 >
//                   <FaDownload /> Export Report
//                 </motion.button>
//               </div>
//             </div>
//           </div>
//         </motion.div>

//         {/* Stats Cards Grid */}
//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
//           {stats.map((stat, index) => (
//             <motion.div
//               key={index}
//               initial={{ opacity: 0, y: 20 }}
//               animate={{ opacity: 1, y: 0 }}
//               transition={{ delay: index * 0.1 }}
//               onHoverStart={() => setHoveredCard(index)}
//               onHoverEnd={() => setHoveredCard(null)}
//               className="bg-white rounded-xl shadow-lg hover:shadow-2xl transition-all overflow-hidden"
//             >
//               <div className="p-6">
//                 <div className="flex items-start justify-between mb-4">
//                   <div className={`p-3 rounded-xl bg-gradient-to-br ${stat.color} text-white`}>
//                     <stat.icon className="text-2xl" />
//                   </div>
//                   <motion.span
//                     animate={{ scale: hoveredCard === index ? 1.1 : 1 }}
//                     className="text-sm text-green-600 bg-green-50 px-2 py-1 rounded-full"
//                   >
//                     {stat.trend}
//                   </motion.span>
//                 </div>
//                 <p className="text-gray-600 text-sm mb-1">{stat.label}</p>
//                 <p className="text-3xl font-bold text-gray-800 mb-2">
//                   {stat.value}{stat.suffix || ''}
//                 </p>
//                 <p className="text-sm text-gray-500">{stat.subValue}</p>
//               </div>
              
//               {/* Progress Bar */}
//               <motion.div 
//                 initial={{ scaleX: 0 }}
//                 animate={{ scaleX: 1 }}
//                 transition={{ delay: index * 0.1 + 0.5 }}
//                 className="h-1 bg-gray-100 origin-left"
//               >
//                 <motion.div 
//                   className={`h-full bg-gradient-to-r ${stat.color}`}
//                   initial={{ width: 0 }}
//                   animate={{ width: `${Math.min((stat.value / 100) * 100, 100)}%` }}
//                   transition={{ delay: index * 0.1 + 0.7, duration: 1 }}
//                 />
//               </motion.div>
//             </motion.div>
//           ))}
//         </div>

//         {/* Quick Actions with Descriptions */}
//         <motion.div
//           initial={{ opacity: 0, y: 20 }}
//           animate={{ opacity: 1, y: 0 }}
//           transition={{ delay: 0.3 }}
//           className="mb-8"
//         >
//           <h2 className="text-2xl font-bold mb-6 flex items-center">
//             <FaFlag className="mr-3 text-purple-600" /> Quick Actions
//           </h2>
//           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
//             {quickActions.map((action, index) => (
//               <Link to={action.to} key={index}>
//                 <motion.div
//                   whileHover={{ scale: 1.05, y: -5 }}
//                   whileTap={{ scale: 0.95 }}
//                   className="bg-white rounded-xl shadow-lg p-6 cursor-pointer hover:shadow-2xl transition-all relative overflow-hidden group"
//                 >
//                   <div className={`absolute inset-0 bg-gradient-to-br from-${action.color}-50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity`} />
                  
//                   <div className="relative">
//                     <div className={`w-16 h-16 bg-${action.color}-100 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
//                       <action.icon className={`text-3xl text-${action.color}-600`} />
//                     </div>
//                     <h3 className={`text-xl font-bold text-${action.color}-600 mb-2`}>
//                       {action.label}
//                     </h3>
//                     <p className="text-gray-500 text-sm">
//                       {action.description}
//                     </p>
//                     <motion.div
//                       animate={{ x: [0, 5, 0] }}
//                       transition={{ duration: 2, repeat: Infinity }}
//                       className={`absolute bottom-6 right-6 text-${action.color}-400 opacity-0 group-hover:opacity-100 transition-opacity`}
//                     >
//                       →
//                     </motion.div>
//                   </div>
//                 </motion.div>
//               </Link>
//             ))}
//           </div>
//         </motion.div>

//         {/* Analytics & Recent Elections Grid */}
//         <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
//           {/* Election Status Cards */}
//           <motion.div
//             initial={{ opacity: 0, x: -20 }}
//             animate={{ opacity: 1, x: 0 }}
//             transition={{ delay: 0.4 }}
//             className="lg:col-span-1"
//           >
//             <div className="bg-white rounded-xl shadow-lg p-6">
//               <h3 className="text-lg font-semibold mb-4 flex items-center">
//                 <FaCalendarAlt className="mr-2 text-purple-600" /> Election Status
//               </h3>
//               <div className="space-y-4">
//                 <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
//                   <div className="flex items-center">
//                     <div className="w-3 h-3 bg-green-500 rounded-full mr-3 animate-pulse" />
//                     <span className="font-medium">Ongoing</span>
//                   </div>
//                   <span className="text-2xl font-bold text-green-600">{ongoingElections}</span>
//                 </div>
                
//                 <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
//                   <div className="flex items-center">
//                     <div className="w-3 h-3 bg-yellow-500 rounded-full mr-3" />
//                     <span className="font-medium">Upcoming</span>
//                   </div>
//                   <span className="text-2xl font-bold text-yellow-600">{upcomingElections}</span>
//                 </div>
                
//                 <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
//                   <div className="flex items-center">
//                     <div className="w-3 h-3 bg-gray-500 rounded-full mr-3" />
//                     <span className="font-medium">Completed</span>
//                   </div>
//                   <span className="text-2xl font-bold text-gray-600">{completedElections}</span>
//                 </div>
//               </div>

//               {/* Voter Verification Progress */}
//               <div className="mt-6 pt-6 border-t">
//                 <h4 className="text-sm font-medium text-gray-600 mb-3">Voter Verification</h4>
//                 <div className="flex items-center justify-between mb-2">
//                   <span className="text-sm text-gray-500">Progress</span>
//                   <span className="text-sm font-medium">
//                     {verifiedVoters}/{totalVoters}
//                   </span>
//                 </div>
//                 <div className="w-full bg-gray-200 rounded-full h-2.5">
//                   <motion.div
//                     initial={{ width: 0 }}
//                     animate={{ width: `${totalVoters ? (verifiedVoters / totalVoters) * 100 : 0}%` }}
//                     transition={{ duration: 1 }}
//                     className="bg-purple-600 h-2.5 rounded-full"
//                   />
//                 </div>
//                 <div className="flex justify-between mt-2 text-xs text-gray-500">
//                   <span>✅ {verifiedVoters} Verified</span>
//                   <span>⏳ {pendingVoters} Pending</span>
//                 </div>
//               </div>
//             </div>
//           </motion.div>

//           {/* Recent Elections */}
//           <motion.div
//             initial={{ opacity: 0, x: 20 }}
//             animate={{ opacity: 1, x: 0 }}
//             transition={{ delay: 0.4 }}
//             className="lg:col-span-2"
//           >
//             <div className="bg-white rounded-xl shadow-lg p-6">
//               <div className="flex items-center justify-between mb-6">
//                 <h3 className="text-lg font-semibold flex items-center">
//                   <FaPoll className="mr-2 text-purple-600" /> Recent Elections
//                 </h3>
//                 <Link to="/admin/elections" className="text-sm text-purple-600 hover:underline">
//                   View All →
//                 </Link>
//               </div>

//               {elections.length === 0 ? (
//                 <div className="text-center py-12">
//                   <p className="text-gray-500 mb-4">No elections created yet</p>
//                   <Link to="/admin/create-election">
//                     <motion.button
//                       whileHover={{ scale: 1.05 }}
//                       whileTap={{ scale: 0.95 }}
//                       className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition"
//                     >
//                       Create Your First Election
//                     </motion.button>
//                   </Link>
//                 </div>
//               ) : (
//                 <div className="space-y-4">
//                   {elections.slice(0, 5).map((election, index) => (
//                     <motion.div
//                       key={election._id}
//                       initial={{ opacity: 0, x: -20 }}
//                       animate={{ opacity: 1, x: 0 }}
//                       transition={{ delay: index * 0.1 }}
//                       className="flex items-center justify-between p-4 hover:bg-gray-50 rounded-lg transition group"
//                     >
//                       <div className="flex items-center flex-1">
//                         <div className={`w-2 h-2 rounded-full mr-3 ${
//                           election.status === 'ongoing' ? 'bg-green-500' :
//                           election.status === 'upcoming' ? 'bg-yellow-500' : 'bg-gray-500'
//                         }`} />
//                         <div className="flex-1">
//                           <h4 className="font-medium">{election.title}</h4>
//                           <p className="text-sm text-gray-500">
//                             {election.description?.substring(0, 50)}...
//                           </p>
//                         </div>
//                       </div>
                      
//                       <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition">
//                         <motion.button
//                           whileHover={{ scale: 1.1 }}
//                           whileTap={{ scale: 0.9 }}
//                           className="p-2 hover:bg-blue-100 rounded-lg text-blue-600"
//                         >
//                           <FaEye />
//                         </motion.button>
//                         <motion.button
//                           whileHover={{ scale: 1.1 }}
//                           whileTap={{ scale: 0.9 }}
//                           className="p-2 hover:bg-green-100 rounded-lg text-green-600"
//                         >
//                           <FaEdit />
//                         </motion.button>
//                         <motion.button
//                           whileHover={{ scale: 1.1 }}
//                           whileTap={{ scale: 0.9 }}
//                           className="p-2 hover:bg-red-100 rounded-lg text-red-600"
//                         >
//                           <FaTrash />
//                         </motion.button>
//                       </div>
//                     </motion.div>
//                   ))}
//                 </div>
//               )}
//             </div>
//           </motion.div>
//         </div>

//         {/* Bottom Stats */}
//         <motion.div
//           initial={{ opacity: 0, y: 20 }}
//           animate={{ opacity: 1, y: 0 }}
//           transition={{ delay: 0.5 }}
//           className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8"
//         >
//           <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl shadow-lg p-6 text-white">
//             <FaClock className="text-3xl mb-3 opacity-80" />
//             <p className="text-sm opacity-90">Next Election</p>
//             <p className="text-xl font-bold">Lok Sabha 2024</p>
//             <p className="text-sm opacity-80 mt-2">Starts in 5 days</p>
//           </div>
          
//           <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl shadow-lg p-6 text-white">
//             <FaUserCheck className="text-3xl mb-3 opacity-80" />
//             <p className="text-sm opacity-90">Pending Verifications</p>
//             <p className="text-xl font-bold">{pendingVoters} Voters</p>
//             <p className="text-sm opacity-80 mt-2">Need approval</p>
//           </div>
          
//           <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl shadow-lg p-6 text-white">
//             <FaChartBar className="text-3xl mb-3 opacity-80" />
//             <p className="text-sm opacity-90">Total Votes Cast</p>
//             <p className="text-xl font-bold">1,234</p>
//             <p className="text-sm opacity-80 mt-2">Across all elections</p>
//           </div>
//         </motion.div>
//       </div>
//     </div>
//   );
// };

// export default AdminDashboard;





// import React, { useState, useEffect } from 'react';
// import { motion } from 'framer-motion';
// import { FaVoteYea, FaUsers, FaCheckCircle, FaPlusCircle } from 'react-icons/fa';
// import { Link } from 'react-router-dom';
// import toast from 'react-hot-toast';
// import { getElections, getVoters } from '../services/api';

// const AdminDashboard = () => {
//   const [elections, setElections] = useState([]);
//   const [voters, setVoters] = useState([]);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     fetchData();
//   }, []);

//   const fetchData = async () => {
//     try {
//       const [electionsRes, votersRes] = await Promise.all([
//         getElections(),
//         getVoters()
//       ]);
//       setElections(electionsRes.data);
//       setVoters(votersRes.data);
//     } catch (error) {
//       toast.error('Failed to fetch data');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const stats = [
//     { 
//       label: 'Total Elections', 
//       value: elections.length, 
//       icon: FaVoteYea, 
//       color: 'bg-blue-500' 
//     },
//     { 
//       label: 'Total Voters', 
//       value: voters.length, 
//       icon: FaUsers, 
//       color: 'bg-green-500' 
//     },
//     { 
//       label: 'Verified Voters', 
//       value: voters.filter(v => v.isVerified).length, 
//       icon: FaCheckCircle, 
//       color: 'bg-purple-500' 
//     },
//   ];

//   return (
//     <div className="container mx-auto px-4 py-8">
//       {/* Welcome Banner */}
//       <motion.div
//         initial={{ opacity: 0, y: -20 }}
//         animate={{ opacity: 1, y: 0 }}
//         className="bg-gradient-to-r from-purple-600 to-purple-800 rounded-2xl shadow-2xl p-8 mb-8 text-white"
//       >
//         <h1 className="text-4xl font-bold mb-2">Admin Dashboard 👋</h1>
//         <p className="text-xl opacity-90">Manage elections, candidates and voters</p>
//       </motion.div>

//       {/* Stats Cards */}
//       <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
//         {stats.map((stat, index) => (
//           <motion.div
//             key={index}
//             initial={{ opacity: 0, y: 20 }}
//             animate={{ opacity: 1, y: 0 }}
//             transition={{ delay: index * 0.1 }}
//             className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-all"
//           >
//             <div className="flex items-center space-x-4">
//               <div className={`${stat.color} p-3 rounded-lg`}>
//                 <stat.icon className="text-white text-2xl" />
//               </div>
//               <div>
//                 <p className="text-gray-600">{stat.label}</p>
//                 <p className="text-2xl font-bold">{stat.value}</p>
//               </div>
//             </div>
//           </motion.div>
//         ))}
//       </div>

//       {/* Quick Actions */}
//       <h2 className="text-2xl font-bold mb-6">Quick Actions</h2>
//       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
//         <Link to="/admin/create-election">
//           <motion.div
//             whileHover={{ scale: 1.05 }}
//             className="card cursor-pointer text-center hover:border-blue-500"
//           >
//             <FaPlusCircle className="text-4xl text-blue-500 mx-auto mb-3" />
//             <h3 className="font-semibold">Create Election</h3>
//           </motion.div>
//         </Link>
        
//         <Link to="/admin/candidates">
//           <motion.div
//             whileHover={{ scale: 1.05 }}
//             className="card cursor-pointer text-center hover:border-green-500"
//           >
//             <FaUsers className="text-4xl text-green-500 mx-auto mb-3" />
//             <h3 className="font-semibold">Manage Candidates</h3>
//           </motion.div>
//         </Link>
        
//         <Link to="/admin/voters">
//           <motion.div
//             whileHover={{ scale: 1.05 }}
//             className="card cursor-pointer text-center hover:border-purple-500"
//           >
//             <FaCheckCircle className="text-4xl text-purple-500 mx-auto mb-3" />
//             <h3 className="font-semibold">Verify Voters</h3>
//           </motion.div>
//         </Link>
        
//         <Link to="/admin/results">
//           <motion.div
//             whileHover={{ scale: 1.05 }}
//             className="card cursor-pointer text-center hover:border-yellow-500"
//           >
//             <FaVoteYea className="text-4xl text-yellow-500 mx-auto mb-3" />
//             <h3 className="font-semibold">View Results</h3>
//           </motion.div>
//         </Link>
//       </div>

//       {/* Recent Elections */}
//       <h2 className="text-2xl font-bold mb-6">Recent Elections</h2>
//       {elections.length === 0 ? (
//         <div className="text-center py-12 bg-white rounded-xl shadow">
//           <p className="text-gray-500 text-lg">No elections created yet</p>
//           <Link to="/admin/create-election">
//             <button className="btn-primary mt-4">
//               Create Your First Election
//             </button>
//           </Link>
//         </div>
//       ) : (
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//           {elections.slice(0, 4).map((election) => (
//             <div key={election._id} className="card">
//               <h3 className="text-xl font-semibold">{election.title}</h3>
//               <p className="text-gray-600 mt-2">{election.description}</p>
//               <div className="mt-4 flex justify-between items-center">
//                 <span className={`px-3 py-1 rounded-full text-sm ${
//                   election.status === 'ongoing' ? 'bg-green-100 text-green-600' :
//                   election.status === 'upcoming' ? 'bg-yellow-100 text-yellow-600' :
//                   'bg-gray-100 text-gray-600'
//                 }`}>
//                   {election.status}
//                 </span>
//                 <Link to={`/admin/elections/${election._id}`}>
//                   <button className="text-primary-600 hover:underline">
//                     Manage →
//                   </button>
//                 </Link>
//               </div>
//             </div>
//           ))}
//         </div>
//       )}
//     </div>
//   );
// };

// export default AdminDashboard;