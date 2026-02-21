import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaArrowLeft, FaChartBar, FaEye } from 'react-icons/fa';
import toast from 'react-hot-toast';
import { getElections } from '../services/api';

const AdminResults = () => {
  const [elections, setElections] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchElections();
  }, []);

  const fetchElections = async () => {
    try {
      const response = await getElections();
      setElections(response.data);
    } catch (error) {
      toast.error('Failed to load elections');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <Link to="/admin" className="flex items-center text-gray-600 hover:text-primary-600 mb-6">
        <FaArrowLeft className="mr-2" /> Back to Dashboard
      </Link>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-2xl shadow-2xl p-8"
      >
        <h1 className="text-3xl font-bold text-primary-600 mb-2">Election Results</h1>
        <p className="text-gray-600 mb-8">Select an election to view results</p>

        {loading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
          </div>
        ) : elections.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500">No elections found</p>
          </div>
        ) : (
          <div className="space-y-4">
            {elections.map((election) => (
              <Link
                key={election._id}
                to={`/results/${election._id}`}
                className="block bg-gray-50 rounded-lg p-4 hover:bg-gray-100 transition"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold text-lg">{election.title}</h3>
                    <p className="text-gray-600 text-sm">{election.description}</p>
                    <span className={`inline-block mt-2 px-2 py-1 rounded-full text-xs ${
                      election.status === 'completed' ? 'bg-green-100 text-green-600' : 'bg-yellow-100 text-yellow-600'
                    }`}>
                      {election.status}
                    </span>
                  </div>
                  <FaEye className="text-2xl text-primary-600" />
                </div>
              </Link>
            ))}
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default AdminResults;