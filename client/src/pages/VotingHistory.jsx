import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    FaHistory, FaCalendarAlt, FaClock, FaArrowLeft, FaVoteYea,
    FaCheckCircle, FaUser, FaFlag, FaPoll, FaChartPie,
    FaSearch, FaFilter, FaSortAmountDown, FaTimes
} from 'react-icons/fa';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { getVotingHistory } from '../services/api';

const VotingHistory = () => {
    const [history, setHistory] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedYear, setSelectedYear] = useState('all');
    const [searchTerm, setSearchTerm] = useState('');
    const [sortOrder, setSortOrder] = useState('desc');
    const [hoveredCard, setHoveredCard] = useState(null);

    useEffect(() => {
        fetchHistory();
    }, []);

    const fetchHistory = async () => {
        try {
            const response = await getVotingHistory();
            setHistory(response.data);
        } catch (error) {
            toast.error('Failed to load voting history');
        } finally {
            setLoading(false);
        }
    };

    // Get unique years from history
    const years = ['all', ...new Set(history.map(v =>
        new Date(v.timestamp).getFullYear().toString()
    ))];

    // Filter and sort history
    const filteredHistory = history
        .filter(vote => {
            const matchesYear = selectedYear === 'all' ||
                new Date(vote.timestamp).getFullYear().toString() === selectedYear;
            const matchesSearch = searchTerm === '' ||
                vote.electionId?.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                vote.candidateId?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                vote.candidateId?.party?.toLowerCase().includes(searchTerm.toLowerCase());
            return matchesYear && matchesSearch;
        })
        .sort((a, b) => {
            const dateA = new Date(a.timestamp);
            const dateB = new Date(b.timestamp);
            return sortOrder === 'desc' ? dateB - dateA : dateA - dateB;
        });

    // Statistics
    const totalVotes = history.length;
    const uniqueElections = new Set(history.map(v => v.electionId?._id)).size;
    const lastVote = history[0]?.timestamp;
    const firstVote = history[history.length - 1]?.timestamp;

    if (loading) {
        return (
            <div className="min-h-screen flex justify-center items-center bg-gradient-to-br from-primary-50 to-primary-100">
                <div className="text-center">
                    <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                        className="w-20 h-20 border-4 border-primary-200 border-t-primary-600 rounded-full mx-auto mb-4"
                    />
                    <p className="text-gray-600 animate-pulse">Loading your voting history...</p>
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
                    <div className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-xl p-6 border border-white/20">
                        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                            <div>
                                <Link
                                    to="/voter"
                                    className="inline-flex items-center text-gray-600 hover:text-primary-600 transition group mb-4"
                                >
                                    <FaArrowLeft className="mr-2 group-hover:-translate-x-1 transition-transform" />
                                    Back to Dashboard
                                </Link>
                                <h1 className="text-4xl font-bold bg-gradient-to-r from-primary-600 to-primary-800 bg-clip-text text-transparent flex items-center">
                                    <FaHistory className="mr-3 text-primary-600" />
                                    Your Voting Journey
                                </h1>
                                <p className="text-gray-600 mt-2 text-lg">
                                    Every vote tells a story. Here's yours.
                                </p>
                            </div>

                            {/* Stats Badge */}
                            <motion.div
                                whileHover={{ scale: 1.05 }}
                                className="bg-primary-50 rounded-xl p-4 text-center"
                            >
                                <p className="text-3xl font-bold text-primary-600">{totalVotes}</p>
                                <p className="text-sm text-gray-600">Total Votes Cast</p>
                            </motion.div>
                        </div>
                    </div>
                </motion.div>

                {history.length === 0 ? (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="text-center py-20 bg-white/80 backdrop-blur-lg rounded-3xl shadow-2xl"
                    >
                        <motion.div
                            animate={{
                                y: [0, -10, 0],
                                rotate: [0, 5, -5, 0]
                            }}
                            transition={{ duration: 4, repeat: Infinity }}
                            className="inline-block"
                        >
                            <FaVoteYea className="text-8xl text-primary-300 mx-auto mb-6" />
                        </motion.div>
                        <h2 className="text-3xl font-bold text-gray-800 mb-3">No Voting History Yet</h2>
                        <p className="text-gray-500 text-lg mb-8">Your first vote is waiting to be cast!</p>
                        <Link to="/voter">
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                className="btn-primary text-lg px-8 py-4"
                            >
                                Browse Active Elections
                            </motion.button>
                        </Link>
                    </motion.div>
                ) : (
                    <>
                        {/* Filters & Search Bar */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="mb-8"
                        >
                            <div className="bg-white rounded-xl shadow-lg p-6">
                                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                                    {/* Search */}
                                    <div className="col-span-2">
                                        <div className="relative">
                                            <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                                            <input
                                                type="text"
                                                placeholder="Search by election, candidate, or party..."
                                                value={searchTerm}
                                                onChange={(e) => setSearchTerm(e.target.value)}
                                                className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
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
                                    </div>

                                    {/* Year Filter */}
                                    <div>
                                        <select
                                            value={selectedYear}
                                            onChange={(e) => setSelectedYear(e.target.value)}
                                            className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 appearance-none bg-white"
                                        >
                                            {years.map(year => (
                                                <option key={year} value={year}>
                                                    {year === 'all' ? 'All Years' : year}
                                                </option>
                                            ))}
                                        </select>
                                    </div>

                                    {/* Sort Order */}
                                    <div>
                                        <button
                                            onClick={() => setSortOrder(sortOrder === 'desc' ? 'asc' : 'desc')}
                                            className="w-full px-4 py-3 border border-gray-200 rounded-lg hover:bg-gray-50 flex items-center justify-center gap-2 transition"
                                        >
                                            <FaSortAmountDown className={`transform ${sortOrder === 'asc' ? 'rotate-180' : ''}`} />
                                            {sortOrder === 'desc' ? 'Newest First' : 'Oldest First'}
                                        </button>
                                    </div>
                                </div>

                                {/* Results Count */}
                                <div className="mt-4 text-sm text-gray-500">
                                    Showing {filteredHistory.length} of {history.length} votes
                                </div>
                            </div>
                        </motion.div>

                        {/* Statistics Cards */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 }}
                            className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8"
                        >
                            <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl shadow-lg p-6 text-white">
                                <FaPoll className="text-3xl mb-3 opacity-80" />
                                <p className="text-sm opacity-90">Total Votes</p>
                                <p className="text-3xl font-bold">{totalVotes}</p>
                            </div>

                            <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl shadow-lg p-6 text-white">
                                <FaFlag className="text-3xl mb-3 opacity-80" />
                                <p className="text-sm opacity-90">Elections Participated</p>
                                <p className="text-3xl font-bold">{uniqueElections}</p>
                            </div>

                            <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl shadow-lg p-6 text-white">
                                <FaCalendarAlt className="text-3xl mb-3 opacity-80" />
                                <p className="text-sm opacity-90">First Vote</p>
                                <p className="text-lg font-semibold">
                                    {firstVote ? new Date(firstVote).toLocaleDateString('en-IN', {
                                        day: 'numeric',
                                        month: 'short',
                                        year: 'numeric'
                                    }) : 'N/A'}
                                </p>
                            </div>

                            <div className="bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-xl shadow-lg p-6 text-white">
                                <FaClock className="text-3xl mb-3 opacity-80" />
                                <p className="text-sm opacity-90">Latest Vote</p>
                                <p className="text-lg font-semibold">
                                    {lastVote ? new Date(lastVote).toLocaleDateString('en-IN', {
                                        day: 'numeric',
                                        month: 'short',
                                        year: 'numeric'
                                    }) : 'N/A'}
                                </p>
                            </div>
                        </motion.div>

                        {/* Voting Timeline */}
                        <AnimatePresence>
                            {filteredHistory.length === 0 ? (
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    className="text-center py-12 bg-white rounded-xl shadow"
                                >
                                    <p className="text-gray-500">No votes match your filters</p>
                                </motion.div>
                            ) : (
                                <div className="space-y-4">
                                    {filteredHistory.map((vote, index) => (
                                        <motion.div
                                            key={vote._id}
                                            initial={{ opacity: 0, x: -20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            exit={{ opacity: 0, x: 20 }}
                                            transition={{ delay: index * 0.05 }}
                                            onHoverStart={() => setHoveredCard(vote._id)}
                                            onHoverEnd={() => setHoveredCard(null)}
                                            className="relative"
                                        >
                                            {/* Timeline Line */}
                                            {index < filteredHistory.length - 1 && (
                                                <div className="absolute left-8 top-20 bottom-0 w-0.5 bg-gradient-to-b from-primary-400 to-primary-200 hidden md:block" />
                                            )}

                                            <motion.div
                                                animate={{
                                                    scale: hoveredCard === vote._id ? 1.02 : 1,
                                                    boxShadow: hoveredCard === vote._id ? '0 20px 25px -5px rgba(0,0,0,0.1), 0 10px 10px -5px rgba(0,0,0,0.04)' : '0 4px 6px -1px rgba(0,0,0,0.1)'
                                                }}
                                                className="bg-white rounded-xl shadow-lg p-6 hover:shadow-2xl transition-all border-l-4 border-primary-600 relative overflow-hidden group"
                                            >
                                                {/* Background Pattern */}
                                                <div className="absolute inset-0 opacity-5">
                                                    <div className="absolute -right-10 -top-10 w-40 h-40 bg-primary-600 rounded-full" />
                                                    <div className="absolute -left-10 -bottom-10 w-40 h-40 bg-primary-400 rounded-full" />
                                                </div>

                                                <div className="relative">
                                                    {/* Timeline Dot */}
                                                    <div className="absolute left-0 top-1/2 -translate-y-1/2 w-4 h-4 bg-primary-600 rounded-full border-4 border-white shadow-lg hidden md:block" />

                                                    <div className="md:ml-8">
                                                        <div className="flex flex-col md:flex-row md:items-start gap-6">
                                                            {/* Election Icon */}
                                                            <div className="hidden md:block">
                                                                <div className="w-16 h-16 bg-primary-100 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
                                                                    <FaPoll className="text-3xl text-primary-600" />
                                                                </div>
                                                            </div>

                                                            {/* Content */}
                                                            <div className="flex-1">
                                                                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
                                                                    <div>
                                                                        <h3 className="text-xl font-bold text-gray-800 group-hover:text-primary-600 transition">
                                                                            {vote.electionId?.title || 'Election'}
                                                                        </h3>
                                                                        <p className="text-gray-600 text-sm mt-1">
                                                                            {vote.electionId?.description || 'No description'}
                                                                        </p>
                                                                    </div>

                                                                    <motion.div
                                                                        animate={{
                                                                            rotate: hoveredCard === vote._id ? [0, 10, -10, 0] : 0
                                                                        }}
                                                                        transition={{ duration: 0.5 }}
                                                                    >
                                                                        <span className="bg-green-100 text-green-600 px-4 py-2 rounded-full text-sm flex items-center gap-2">
                                                                            <FaCheckCircle /> Vote Recorded
                                                                        </span>
                                                                    </motion.div>
                                                                </div>

                                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                                    {/* Candidate Info */}
                                                                    <div className="bg-gradient-to-r from-primary-50 to-primary-100 rounded-lg p-4">
                                                                        <p className="text-sm text-primary-600 mb-2 flex items-center">
                                                                            <FaUser className="mr-2" /> Your Choice
                                                                        </p>
                                                                        <p className="text-lg font-semibold text-gray-800">
                                                                            {vote.candidateId?.name || 'Candidate'}
                                                                        </p>
                                                                        {vote.candidateId?.party && (
                                                                            <p className="text-primary-600 text-sm mt-1">
                                                                                {vote.candidateId.party}
                                                                            </p>
                                                                        )}
                                                                    </div>

                                                                    {/* Date & Time */}
                                                                    <div className="bg-gray-50 rounded-lg p-4">
                                                                        <p className="text-sm text-gray-500 mb-2 flex items-center">
                                                                            <FaCalendarAlt className="mr-2" /> When You Voted
                                                                        </p>
                                                                        <div className="space-y-1">
                                                                            <p className="font-semibold text-gray-800">
                                                                                {new Date(vote.timestamp).toLocaleDateString('en-IN', {
                                                                                    weekday: 'long',
                                                                                    day: 'numeric',
                                                                                    month: 'long',
                                                                                    year: 'numeric'
                                                                                })}
                                                                            </p>
                                                                            <p className="text-primary-600 text-sm flex items-center">
                                                                                <FaClock className="mr-1" />
                                                                                {new Date(vote.timestamp).toLocaleTimeString('en-IN', {
                                                                                    hour: '2-digit',
                                                                                    minute: '2-digit',
                                                                                    second: '2-digit'
                                                                                })}
                                                                            </p>
                                                                        </div>
                                                                    </div>
                                                                </div>

                                                                {/* Vote ID */}
                                                                <div className="mt-4 text-xs text-gray-400 font-mono">
                                                                    Vote ID: {vote._id}
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </motion.div>
                                        </motion.div>
                                    ))}
                                </div>
                            )}
                        </AnimatePresence>
                    </>
                )}
            </div>
        </div>
    );
};

export default VotingHistory;

