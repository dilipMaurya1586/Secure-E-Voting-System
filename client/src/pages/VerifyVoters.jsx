import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaCheckCircle, FaTimesCircle, FaUserCheck, FaArrowLeft } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { getVoters, verifyVoter } from '../services/api';

const VerifyVoters = () => {
    const [voters, setVoters] = useState([]);
    const [loading, setLoading] = useState(true);
    const [verifying, setVerifying] = useState(false);

    useEffect(() => {
        fetchVoters();
    }, []);

    const fetchVoters = async () => {
        try {
            const response = await getVoters();
            setVoters(response.data);
        } catch (error) {
            toast.error('Failed to load voters');
        } finally {
            setLoading(false);
        }
    };

    const handleVerify = async (voterId) => {
        setVerifying(true);
        try {
            await verifyVoter(voterId);
            toast.success('Voter verified successfully!');
            // Update local state
            setVoters(voters.map(voter =>
                voter._id === voterId ? { ...voter, isVerified: true } : voter
            ));
        } catch (error) {
            toast.error('Failed to verify voter');
        } finally {
            setVerifying(false);
        }
    };

    const stats = {
        total: voters.length,
        verified: voters.filter(v => v.isVerified).length,
        pending: voters.filter(v => !v.isVerified).length
    };

    return (
        <div className="container mx-auto px-4 py-8">
            {/* Back Button */}
            <Link to="/admin" className="flex items-center text-gray-600 hover:text-primary-600 mb-6">
                <FaArrowLeft className="mr-2" /> Back to Dashboard
            </Link>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-2xl shadow-2xl p-8"
            >
                <h1 className="text-3xl font-bold text-primary-600 mb-2">Verify Voters</h1>
                <p className="text-gray-600 mb-8">Approve voter registrations</p>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <div className="bg-blue-50 rounded-xl p-6 text-center">
                        <p className="text-gray-600 mb-2">Total Voters</p>
                        <p className="text-3xl font-bold text-blue-600">{stats.total}</p>
                    </div>
                    <div className="bg-green-50 rounded-xl p-6 text-center">
                        <p className="text-gray-600 mb-2">Verified</p>
                        <p className="text-3xl font-bold text-green-600">{stats.verified}</p>
                    </div>
                    <div className="bg-yellow-50 rounded-xl p-6 text-center">
                        <p className="text-gray-600 mb-2">Pending</p>
                        <p className="text-3xl font-bold text-yellow-600">{stats.pending}</p>
                    </div>
                </div>

                {loading ? (
                    <div className="flex justify-center py-12">
                        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
                    </div>
                ) : voters.length === 0 ? (
                    <div className="text-center py-12">
                        <p className="text-gray-500">No voters found</p>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {voters.map((voter) => (
                            <motion.div
                                key={voter._id}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                className="bg-gray-50 rounded-lg p-4 flex items-center justify-between"
                            >
                                <div className="flex items-center space-x-4">
                                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${voter.isVerified ? 'bg-green-100' : 'bg-yellow-100'
                                        }`}>
                                        <FaUserCheck className={voter.isVerified ? 'text-green-600' : 'text-yellow-600'} />
                                    </div>
                                    <div>
                                        <h3 className="font-semibold">{voter.name}</h3>
                                        <p className="text-sm text-gray-600">{voter.email}</p>
                                        <p className="text-xs text-gray-500">Registered: {new Date(voter.createdAt).toLocaleDateString()}</p>
                                    </div>
                                </div>

                                <div className="flex items-center space-x-3">
                                    {voter.isVerified ? (
                                        <span className="flex items-center text-green-600">
                                            <FaCheckCircle className="mr-1" /> Verified
                                        </span>
                                    ) : (
                                        <button
                                            onClick={() => handleVerify(voter._id)}
                                            disabled={verifying}
                                            className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition disabled:bg-gray-400"
                                        >
                                            Verify Now
                                        </button>
                                    )}
                                </div>
                            </motion.div>
                        ))}
                    </div>
                )}
            </motion.div>
        </div>
    );
};

export default VerifyVoters;