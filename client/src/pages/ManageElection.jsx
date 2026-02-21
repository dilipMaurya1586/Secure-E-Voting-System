import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaArrowLeft, FaEdit, FaTrash, FaPlus, FaUserCheck } from 'react-icons/fa';
import toast from 'react-hot-toast';

import {
    getElectionById,
    updateElection,
    deleteElection,
    getCandidates,
    addCandidate,
    getAdminCandidates,
} from '../services/api';

const ManageElection = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [election, setElection] = useState(null);
    const [candidates, setCandidates] = useState([]);
    const [loading, setLoading] = useState(true);
    const [editing, setEditing] = useState(false);
    const [showAddCandidate, setShowAddCandidate] = useState(false);
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        startDate: '',
        endDate: ''
    });
    const [candidateForm, setCandidateForm] = useState({
        name: '',
        party: '',
        manifesto: ''
    });

    useEffect(() => {
        fetchElectionData();
    }, [id]);

    const fetchElectionData = async () => {
        try {
            const [electionRes, candidatesRes] = await Promise.all([
                getElectionById(id),
                getCandidates(id)
            ]);
            setElection(electionRes.data);
            setCandidates(candidatesRes.data);

            // Set form data for editing
            setFormData({
                title: electionRes.data.title,
                description: electionRes.data.description || '',
                startDate: electionRes.data.startDate.slice(0, 16),
                endDate: electionRes.data.endDate.slice(0, 16)
            });
        } catch (error) {
            toast.error('Failed to load election data');
        } finally {
            setLoading(false);
        }
    };

    const handleUpdate = async (e) => {
        e.preventDefault();
        try {
            await updateElection(id, formData);
            toast.success('Election updated successfully!');
            setEditing(false);
            fetchElectionData();
        } catch (error) {
            toast.error('Failed to update election');
        }
    };

    const handleDelete = async () => {
        if (window.confirm('Are you sure you want to delete this election? This will also delete all candidates.')) {
            try {
                await deleteElection(id);
                toast.success('Election deleted successfully!');
                navigate('/admin');
            } catch (error) {
                toast.error('Failed to delete election');
            }
        }
    };

    const handleAddCandidate = async (e) => {
        e.preventDefault();
        if (!candidateForm.name) {
            toast.error('Candidate name is required');
            return;
        }

        try {
            await addCandidate(id, candidateForm);
            toast.success('Candidate added successfully!');
            setCandidateForm({ name: '', party: '', manifesto: '' });
            setShowAddCandidate(false);
            fetchElectionData(); // Refresh candidates list
        } catch (error) {
            toast.error('Failed to add candidate');
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-primary-600"></div>
            </div>
        );
    }

    if (!election) {
        return (
            <div className="container mx-auto px-4 py-8 text-center">
                <p className="text-gray-500">Election not found</p>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8">
            {/* Back Button */}
            <button
                onClick={() => navigate('/admin')}
                className="flex items-center text-gray-600 hover:text-primary-600 mb-6"
            >
                <FaArrowLeft className="mr-2" /> Back to Dashboard
            </button>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-2xl shadow-2xl p-8"
            >
                {/* Header */}
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-3xl font-bold text-primary-600">Manage Election</h1>
                    <div className="flex space-x-3">
                        <button
                            onClick={() => setEditing(!editing)}
                            className="flex items-center bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                        >
                            <FaEdit className="mr-2" /> Edit
                        </button>
                        <button
                            onClick={handleDelete}
                            className="flex items-center bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700"
                        >
                            <FaTrash className="mr-2" /> Delete
                        </button>
                    </div>
                </div>

                {/* Election Details */}
                {editing ? (
                    <form onSubmit={handleUpdate} className="space-y-4 mb-8">
                        <div>
                            <label className="block text-gray-700 mb-2">Title *</label>
                            <input
                                type="text"
                                value={formData.title}
                                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                className="w-full px-4 py-2 border rounded-lg"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-gray-700 mb-2">Description</label>
                            <textarea
                                value={formData.description}
                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                rows="3"
                                className="w-full px-4 py-2 border rounded-lg"
                            />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-gray-700 mb-2">Start Date</label>
                                <input
                                    type="datetime-local"
                                    value={formData.startDate}
                                    onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                                    className="w-full px-4 py-2 border rounded-lg"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-gray-700 mb-2">End Date</label>
                                <input
                                    type="datetime-local"
                                    value={formData.endDate}
                                    onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                                    className="w-full px-4 py-2 border rounded-lg"
                                    required
                                />
                            </div>
                        </div>
                        <div className="flex space-x-3">
                            <button type="submit" className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700">
                                Save Changes
                            </button>
                            <button
                                type="button"
                                onClick={() => setEditing(false)}
                                className="bg-gray-400 text-white px-6 py-2 rounded-lg hover:bg-gray-500"
                            >
                                Cancel
                            </button>
                        </div>
                    </form>
                ) : (
                    <div className="bg-gray-50 rounded-lg p-6 mb-8">
                        <h2 className="text-2xl font-bold mb-2">{election.title}</h2>
                        <p className="text-gray-600 mb-4">{election.description}</p>
                        <div className="grid grid-cols-2 gap-4 text-sm">
                            <div>
                                <p className="text-gray-500">Start Date</p>
                                <p className="font-medium">{new Date(election.startDate).toLocaleString()}</p>
                            </div>
                            <div>
                                <p className="text-gray-500">End Date</p>
                                <p className="font-medium">{new Date(election.endDate).toLocaleString()}</p>
                            </div>
                            <div>
                                <p className="text-gray-500">Status</p>
                                <span className={`inline-block px-2 py-1 rounded-full text-xs ${election.status === 'ongoing' ? 'bg-green-100 text-green-600' :
                                    election.status === 'upcoming' ? 'bg-yellow-100 text-yellow-600' :
                                        'bg-gray-100 text-gray-600'
                                    }`}>
                                    {election.status}
                                </span>
                            </div>
                        </div>
                    </div>
                )}

                {/* Candidates Section */}
                <div className="mt-8">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-2xl font-bold">Candidates</h2>
                        <button
                            onClick={() => setShowAddCandidate(!showAddCandidate)}
                            className="flex items-center bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700"
                        >
                            <FaPlus className="mr-2" /> Add Candidate
                        </button>
                    </div>

                    {/* Add Candidate Form */}
                    {showAddCandidate && (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            className="mb-6 p-4 bg-gray-50 rounded-lg"
                        >
                            <form onSubmit={handleAddCandidate} className="space-y-3">
                                <div>
                                    <label className="block text-gray-700 mb-2">Name *</label>
                                    <input
                                        type="text"
                                        value={candidateForm.name}
                                        onChange={(e) => setCandidateForm({ ...candidateForm, name: e.target.value })}
                                        className="w-full px-4 py-2 border rounded-lg"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-gray-700 mb-2">Party</label>
                                    <input
                                        type="text"
                                        value={candidateForm.party}
                                        onChange={(e) => setCandidateForm({ ...candidateForm, party: e.target.value })}
                                        className="w-full px-4 py-2 border rounded-lg"
                                    />
                                </div>
                                <div>
                                    <label className="block text-gray-700 mb-2">Manifesto</label>
                                    <textarea
                                        value={candidateForm.manifesto}
                                        onChange={(e) => setCandidateForm({ ...candidateForm, manifesto: e.target.value })}
                                        rows="3"
                                        className="w-full px-4 py-2 border rounded-lg"
                                    />
                                </div>
                                <div className="flex space-x-3">
                                    <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700">
                                        Add Candidate
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setShowAddCandidate(false)}
                                        className="bg-gray-400 text-white px-4 py-2 rounded-lg hover:bg-gray-500"
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </form>
                        </motion.div>
                    )}

                    {/* Candidates List */}
                    {candidates.length === 0 ? (
                        <p className="text-gray-500 text-center py-8">No candidates added yet</p>
                    ) : (
                        <div className="space-y-3">
                            {candidates.map((candidate) => (
                                <div key={candidate._id} className="bg-gray-50 rounded-lg p-4">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center space-x-3">
                                            <FaUserCheck className="text-2xl text-primary-600" />
                                            <div>
                                                <h3 className="font-semibold">{candidate.name}</h3>
                                                <p className="text-sm text-gray-600">{candidate.party || 'Independent'}</p>
                                            </div>
                                        </div>
                                        <span className="text-sm bg-primary-100 text-primary-600 px-2 py-1 rounded-full">
                                            {candidate.voteCount || 0} votes
                                        </span>
                                    </div>
                                    {candidate.manifesto && (
                                        <p className="mt-2 text-sm text-gray-600">{candidate.manifesto}</p>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </motion.div>
        </div>
    );
};

export default ManageElection;