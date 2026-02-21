import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaArrowLeft, FaTrophy, FaChartBar, FaCheckCircle, FaList } from 'react-icons/fa';
import toast from 'react-hot-toast';
import { getResults, getElections } from '../services/api';

const Results = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [results, setResults] = useState(null);
  const [elections, setElections] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Agar URL mein ID hai to results fetch karo
    if (id) {
      fetchResults();
    } else {
      // Nahi to elections ki list fetch karo
      fetchElectionsList();
    }
  }, [id]);

  const fetchElectionsList = async () => {
    try {
      const response = await getElections();
      // Sirf completed elections dikhao
      const completedElections = response.data.filter(e => e.status === 'completed');
      setElections(completedElections);
    } catch (error) {
      toast.error('Failed to load elections');
    } finally {
      setLoading(false);
    }
  };

  const fetchResults = async () => {
    try {
      console.log('Fetching results for election:', id);
      const response = await getResults(id);
      setResults(response.data);
    } catch (error) {
      console.error('Error fetching results:', error);
      toast.error('Failed to load results');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  // Agar URL mein ID nahi hai - Elections List dikhao
  if (!id) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-primary-600 flex items-center gap-3">
            <FaList /> Election Results
          </h1>
          <p className="text-gray-600 mt-2">Select an election to view results</p>
        </div>

        {elections.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-xl shadow">
            <p className="text-gray-500 text-lg">No completed elections yet</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {elections.map((election) => (
              <motion.div
                key={election._id}
                whileHover={{ scale: 1.05 }}
                className="bg-white rounded-xl shadow-lg p-6 cursor-pointer hover:shadow-2xl transition-all"
                onClick={() => navigate(`/results/${election._id}`)}
              >
                <h3 className="text-xl font-semibold mb-2">{election.title}</h3>
                <p className="text-gray-600 mb-4">{election.description}</p>
                <p className="text-sm text-gray-400">
                  Ended: {new Date(election.endDate).toLocaleDateString()}
                </p>
                <button className="mt-4 w-full bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700">
                  View Results
                </button>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    );
  }

  // Agar results nahi mile to error message
  if (!results) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <p className="text-gray-500">No results available</p>
        <button
          onClick={() => navigate('/results')}
          className="mt-4 btn-primary"
        >
          Back to Results
        </button>
      </div>
    );
  }

  // Results display karo
  const { election, candidates, totalVotes } = results;
  
  // Winner find karo
  const winner = candidates && candidates.length > 0 
    ? candidates.reduce((max, candidate) => 
        candidate.voteCount > max.voteCount ? candidate : max
      , candidates[0])
    : null;

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Back Button */}
      <button
        onClick={() => navigate('/results')}
        className="flex items-center text-gray-600 hover:text-primary-600 mb-4 transition"
      >
        <FaArrowLeft className="mr-2" /> All Results
      </button>

      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-3xl font-bold text-primary-600">Election Results</h1>
        <p className="text-gray-600 mt-2">{election?.title || 'Untitled Election'}</p>
        <span className={`inline-block mt-2 px-3 py-1 rounded-full text-sm ${
          election?.status === 'completed' ? 'bg-green-100 text-green-600' : 'bg-yellow-100 text-yellow-600'
        }`}>
          {election?.status || 'unknown'}
        </span>
      </motion.div>

      {/* Winner Card */}
      {election?.status === 'completed' && winner && (
        <motion.div
          initial={{ scale: 0.9 }}
          animate={{ scale: 1 }}
          className="bg-gradient-to-r from-yellow-400 to-yellow-600 rounded-2xl shadow-2xl p-8 mb-8 text-white"
        >
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center space-x-2 mb-2">
                <FaTrophy className="text-3xl" />
                <span className="text-xl font-semibold">Winner</span>
              </div>
              <h2 className="text-4xl font-bold mb-2">{winner.name}</h2>
              <p className="text-xl opacity-90">{winner.party || 'Independent'}</p>
              <p className="text-2xl font-bold mt-4">{winner.voteCount} votes</p>
            </div>
            <div className="text-right">
              <p className="text-6xl font-bold">
                {totalVotes > 0 ? Math.round((winner.voteCount / totalVotes) * 100) : 0}%
              </p>
              <p className="text-xl">of total votes</p>
            </div>
          </div>
        </motion.div>
      )}

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 mb-1">Total Votes</p>
              <p className="text-3xl font-bold text-primary-600">{totalVotes || 0}</p>
            </div>
            <FaChartBar className="text-4xl text-primary-300" />
          </div>
        </div>
        
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 mb-1">Candidates</p>
              <p className="text-3xl font-bold text-green-600">{candidates?.length || 0}</p>
            </div>
            <FaCheckCircle className="text-4xl text-green-300" />
          </div>
        </div>
        
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 mb-1">Voter Turnout</p>
              <p className="text-3xl font-bold text-purple-600">
                {totalVotes > 0 ? 'Active' : 'No votes'}
              </p>
            </div>
            <FaTrophy className="text-4xl text-purple-300" />
          </div>
        </div>
      </div>

      {/* Candidates List */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h2 className="text-xl font-bold mb-6">Vote Distribution</h2>
        
        {!candidates || candidates.length === 0 ? (
          <p className="text-gray-500 text-center py-8">No candidates found</p>
        ) : (
          <div className="space-y-6">
            {candidates.map((candidate, index) => {
              const percentage = totalVotes > 0 
                ? ((candidate.voteCount / totalVotes) * 100).toFixed(1)
                : 0;
              
              const isWinner = election?.status === 'completed' && winner?._id === candidate._id;
              
              return (
                <div key={candidate._id} className="relative">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-2">
                      <span className="font-semibold text-lg">{candidate.name}</span>
                      {candidate.party && (
                        <span className="text-sm text-gray-500">({candidate.party})</span>
                      )}
                      {isWinner && (
                        <span className="bg-yellow-100 text-yellow-600 text-xs px-2 py-1 rounded-full">
                          Winner 🏆
                        </span>
                      )}
                    </div>
                    <div className="text-right">
                      <span className="font-bold text-primary-600">{candidate.voteCount}</span>
                      <span className="text-gray-500 ml-2">({percentage}%)</span>
                    </div>
                  </div>
                  
                  {/* Progress Bar */}
                  <div className="w-full bg-gray-200 rounded-full h-4 overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${percentage}%` }}
                      transition={{ duration: 1, delay: index * 0.1 }}
                      className={`h-full rounded-full ${
                        isWinner ? 'bg-yellow-500' : 'bg-primary-600'
                      }`}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default Results;

