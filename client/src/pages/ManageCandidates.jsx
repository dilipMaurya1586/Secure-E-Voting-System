import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaPlus, FaTrash, FaArrowLeft, FaUserPlus } from 'react-icons/fa';
import toast from 'react-hot-toast';
import { getElections, getCandidates, addCandidate, deleteCandidate } from '../services/api';

const ManageCandidates = () => {
    const navigate = useNavigate();
    const [elections, setElections] = useState([]);
    const [selectedElection, setSelectedElection] = useState('');
    const [candidates, setCandidates] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showAddForm, setShowAddForm] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        party: '',
        manifesto: ''
    });

    useEffect(() => {
        fetchElections();
    }, []);

    useEffect(() => {
        if (selectedElection) {
            fetchCandidates();
        }
    }, [selectedElection]);

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

    const fetchCandidates = async () => {
        try {
            const response = await getCandidates(selectedElection);
            setCandidates(response.data);
        } catch (error) {
            toast.error('Failed to load candidates');
        }
    };

    const handleInputChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleAddCandidate = async (e) => {
        e.preventDefault();

        if (!formData.name) {
            toast.error('Candidate name is required');
            return;
        }

        try {
            await addCandidate(selectedElection, formData);
            toast.success('Candidate added successfully!');
            setFormData({ name: '', party: '', manifesto: '' });
            setShowAddForm(false);
            fetchCandidates();
        } catch (error) {
            toast.error(error.response?.data?.msg || 'Failed to add candidate');
        }
    };

    const handleDeleteCandidate = async (candidateId) => {
        if (window.confirm('Are you sure you want to delete this candidate?')) {
            try {
                await deleteCandidate(candidateId);
                toast.success('Candidate deleted');
                fetchCandidates();
            } catch (error) {
                toast.error('Failed to delete candidate');
            }
        }
    };

    return (
        <div className="container mx-auto px-4 py-8">
            {/* Back Button */}
            <button
                onClick={() => navigate(-1)}
                className="flex items-center text-gray-600 hover:text-primary-600 mb-6"
            >
                <FaArrowLeft className="mr-2" /> Back to Dashboard
            </button>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-2xl shadow-2xl p-8"
            >
                <h1 className="text-3xl font-bold text-primary-600 mb-2">Manage Candidates</h1>
                <p className="text-gray-600 mb-8">Add or remove candidates for elections</p>

                {/* Election Selector */}
                <div className="mb-8">
                    <label className="block text-gray-700 font-medium mb-2">Select Election</label>
                    <select
                        value={selectedElection}
                        onChange={(e) => setSelectedElection(e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                    >
                        <option value="">Choose an election...</option>
                        {elections.map(election => (
                            <option key={election._id} value={election._id}>
                                {election.title} ({election.status})
                            </option>
                        ))}
                    </select>
                </div>

                {selectedElection && (
                    <>
                        {/* Add Candidate Button */}
                        <div className="flex justify-end mb-6">
                            <button
                                onClick={() => setShowAddForm(!showAddForm)}
                                className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 flex items-center"
                            >
                                <FaPlus className="mr-2" /> Add Candidate
                            </button>
                        </div>

                        {/* Add Candidate Form */}
                        {showAddForm && (
                            <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                className="mb-8 p-6 bg-gray-50 rounded-lg border"
                            >
                                <h3 className="text-lg font-semibold mb-4 flex items-center">
                                    <FaUserPlus className="mr-2 text-primary-600" /> New Candidate
                                </h3>
                                <form onSubmit={handleAddCandidate} className="space-y-4">
                                    <div>
                                        <label className="block text-gray-700 mb-2">Name *</label>
                                        <input
                                            type="text"
                                            name="name"
                                            value={formData.name}
                                            onChange={handleInputChange}
                                            className="w-full px-4 py-2 border rounded-lg"
                                            placeholder="Candidate name"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-gray-700 mb-2">Party</label>
                                        <input
                                            type="text"
                                            name="party"
                                            value={formData.party}
                                            onChange={handleInputChange}
                                            className="w-full px-4 py-2 border rounded-lg"
                                            placeholder="Political party"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-gray-700 mb-2">Manifesto</label>
                                        <textarea
                                            name="manifesto"
                                            value={formData.manifesto}
                                            onChange={handleInputChange}
                                            rows="3"
                                            className="w-full px-4 py-2 border rounded-lg"
                                            placeholder="Candidate's manifesto..."
                                        />
                                    </div>
                                    <div className="flex gap-2">
                                        <button
                                            type="submit"
                                            className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
                                        >
                                            Save Candidate
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => setShowAddForm(false)}
                                            className="bg-gray-400 text-white px-4 py-2 rounded-lg hover:bg-gray-500"
                                        >
                                            Cancel
                                        </button>
                                    </div>
                                </form>
                            </motion.div>
                        )}

                        {/* Candidates List */}
                        <h2 className="text-xl font-bold mb-4">Candidates List</h2>
                        {candidates.length === 0 ? (
                            <div className="text-center py-8 bg-gray-50 rounded-lg">
                                <p className="text-gray-500">No candidates added yet</p>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {candidates.map(candidate => (
                                    <div
                                        key={candidate._id}
                                        className="bg-gray-50 rounded-lg p-4 flex items-center justify-between"
                                    >
                                        <div>
                                            <h3 className="font-semibold text-lg">{candidate.name}</h3>
                                            <p className="text-gray-600">{candidate.party || 'Independent'}</p>
                                            {candidate.manifesto && (
                                                <p className="text-sm text-gray-500 mt-1">{candidate.manifesto}</p>
                                            )}
                                        </div>
                                        <button
                                            onClick={() => handleDeleteCandidate(candidate._id)}
                                            className="text-red-600 hover:text-red-800 p-2"
                                        >
                                            <FaTrash />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </>
                )}
            </motion.div>
        </div>
    );
};

export default ManageCandidates;
