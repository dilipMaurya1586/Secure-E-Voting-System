import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { FaEye, FaEdit, FaTrash, FaPlus, FaSearch } from 'react-icons/fa';
import toast from 'react-hot-toast';
import { getAdminElections, deleteElection } from '../services/api';

const AllElections = () => {
    const [elections, setElections] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        fetchElections();
    }, []);

    const fetchElections = async () => {
        try {
            const response = await getAdminElections();
            setElections(response.data);
        } catch (error) {
            toast.error('Failed to load elections');
        } finally {
            setLoading(false);
        }
    };

    // ✅ DELETE FUNCTION - With confirmation
    const handleDelete = async (id, title) => {
        // Show confirmation dialog
        const isConfirmed = window.confirm(`Are you sure you want to delete "${title}"? This action cannot be undone.`);

        if (isConfirmed) {
            try {
                await deleteElection(id);
                toast.success(`"${title}" deleted successfully`);
                // Refresh the list after delete
                fetchElections();
            } catch (error) {
                console.error('Delete error:', error);
                toast.error(error.response?.data?.msg || 'Failed to delete election');
            }
        }
    };

    const filteredElections = elections.filter(election =>
        election.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        election.description?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-primary-600"></div>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8">
            {/* Header */}
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold text-gray-800">All Elections</h1>
                <Link to="/admin/create-election">
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="flex items-center gap-2 bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700"
                    >
                        <FaPlus /> Create New Election
                    </motion.button>
                </Link>
            </div>

            {/* Search Bar */}
            <div className="mb-6">
                <div className="relative max-w-md">
                    <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Search elections..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                    />
                </div>
                {searchTerm && (
                    <p className="mt-2 text-sm text-gray-500">
                        Found {filteredElections.length} results
                    </p>
                )}
            </div>

            {/* Elections Table */}
            <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Election
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Status
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Dates
                            </th>
                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Actions
                            </th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {filteredElections.length === 0 ? (
                            <tr>
                                <td colSpan="4" className="px-6 py-4 text-center text-gray-500">
                                    No elections found
                                </td>
                            </tr>
                        ) : (
                            filteredElections.map((election) => (
                                <motion.tr
                                    key={election._id}
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    className="hover:bg-gray-50"
                                >
                                    <td className="px-6 py-4">
                                        <div>
                                            <div className="font-medium text-gray-900">{election.title}</div>
                                            <div className="text-sm text-gray-500">{election.description}</div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${election.status === 'ongoing' ? 'bg-green-100 text-green-800' :
                                                election.status === 'upcoming' ? 'bg-yellow-100 text-yellow-800' :
                                                    'bg-gray-100 text-gray-800'
                                            }`}>
                                            {election.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-500">
                                        <div>Start: {new Date(election.startDate).toLocaleDateString()}</div>
                                        <div>End: {new Date(election.endDate).toLocaleDateString()}</div>
                                    </td>
                                    <td className="px-6 py-4 text-right text-sm font-medium">
                                        <div className="flex justify-end gap-2">
                                            {/* View Button */}
                                            <button
                                                onClick={() => navigate(`/admin/elections/${election._id}`)}
                                                className="text-blue-600 hover:text-blue-900 p-2 rounded-full hover:bg-blue-50 transition"
                                                title="View Details"
                                            >
                                                <FaEye size={18} />
                                            </button>

                                            {/* Edit Button */}
                                            <button
                                                onClick={() => navigate(`/admin/elections/${election._id}/edit`)}
                                                className="text-green-600 hover:text-green-900 p-2 rounded-full hover:bg-green-50 transition"
                                                title="Edit Election"
                                            >
                                                <FaEdit size={18} />
                                            </button>

                                            {/* ✅ DELETE BUTTON - Clearly visible */}
                                            <button
                                                onClick={() => handleDelete(election._id, election.title)}
                                                className="text-red-600 hover:text-red-900 p-2 rounded-full hover:bg-red-50 transition"
                                                title="Delete Election"
                                            >
                                                <FaTrash size={18} />
                                            </button>
                                        </div>
                                    </td>
                                </motion.tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {/* Summary */}
            <div className="mt-6 text-sm text-gray-500">
                Total: {filteredElections.length} elections
            </div>
        </div>
    );
};

export default AllElections;