import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaCalendarAlt, FaAlignLeft, FaHeading, FaArrowLeft } from 'react-icons/fa';
import toast from 'react-hot-toast';
import { createElection } from '../services/api';

const CreateElection = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        startDate: '',
        endDate: ''
    });

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Validation
        if (!formData.title || !formData.startDate || !formData.endDate) {
            toast.error('Please fill all required fields');
            return;
        }

        // Date validation
        const start = new Date(formData.startDate);
        const end = new Date(formData.endDate);

        if (end <= start) {
            toast.error('End date must be after start date');
            return;
        }

        setLoading(true);

        try {
            const response = await createElection({
                title: formData.title,
                description: formData.description,
                startDate: formData.startDate,
                endDate: formData.endDate
            });

            console.log('Election created:', response.data);
            toast.success('Election created successfully! 🎉');

            // Redirect to admin dashboard
            setTimeout(() => {
                navigate('/admin');
            }, 1500);

        } catch (error) {
            console.error('Create election error:', error);
            toast.error(error.response?.data?.msg || 'Failed to create election');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container mx-auto px-4 py-8 max-w-3xl">
            {/* Back Button */}
            <button
                onClick={() => navigate(-1)}
                className="flex items-center text-gray-600 hover:text-primary-600 mb-6 transition"
            >
                <FaArrowLeft className="mr-2" /> Back to Dashboard
            </button>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-2xl shadow-2xl p-8"
            >
                <h1 className="text-3xl font-bold text-primary-600 mb-2">Create New Election</h1>
                <p className="text-gray-600 mb-8">Fill in the details to create a new election</p>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Title */}
                    <div>
                        <label className="block text-gray-700 font-medium mb-2">
                            Election Title <span className="text-red-500">*</span>
                        </label>
                        <div className="relative">
                            <FaHeading className="absolute left-3 top-3 text-gray-400" />
                            <input
                                type="text"
                                name="title"
                                value={formData.title}
                                onChange={handleChange}
                                className="w-full px-4 py-3 pl-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                                placeholder="e.g., Municipal Election 2026"
                                required
                            />
                        </div>
                    </div>

                    {/* Description */}
                    <div>
                        <label className="block text-gray-700 font-medium mb-2">Description</label>
                        <div className="relative">
                            <FaAlignLeft className="absolute left-3 top-3 text-gray-400" />
                            <textarea
                                name="description"
                                value={formData.description}
                                onChange={handleChange}
                                rows="4"
                                className="w-full px-4 py-3 pl-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                                placeholder="Describe the purpose of this election..."
                            />
                        </div>
                    </div>

                    {/* Start Date */}
                    <div>
                        <label className="block text-gray-700 font-medium mb-2">
                            Start Date <span className="text-red-500">*</span>
                        </label>
                        <div className="relative">
                            <FaCalendarAlt className="absolute left-3 top-3 text-gray-400" />
                            <input
                                type="datetime-local"
                                name="startDate"
                                value={formData.startDate}
                                onChange={handleChange}
                                className="w-full px-4 py-3 pl-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                                required
                            />
                        </div>
                        <p className="text-sm text-gray-500 mt-1">
                            When voting will begin
                        </p>
                    </div>

                    {/* End Date */}
                    <div>
                        <label className="block text-gray-700 font-medium mb-2">
                            End Date <span className="text-red-500">*</span>
                        </label>
                        <div className="relative">
                            <FaCalendarAlt className="absolute left-3 top-3 text-gray-400" />
                            <input
                                type="datetime-local"
                                name="endDate"
                                value={formData.endDate}
                                onChange={handleChange}
                                className="w-full px-4 py-3 pl-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                                required
                            />
                        </div>
                        <p className="text-sm text-gray-500 mt-1">
                            When voting will end
                        </p>
                    </div>

                    {/* Submit Buttons */}
                    <div className="flex gap-4 pt-4">
                        <button
                            type="submit"
                            disabled={loading}
                            className="flex-1 bg-primary-600 text-white px-6 py-3 rounded-lg hover:bg-primary-700 transition font-semibold disabled:bg-gray-400"
                        >
                            {loading ? 'Creating...' : 'Create Election'}
                        </button>

                        <button
                            type="button"
                            onClick={() => navigate('/admin')}
                            className="flex-1 bg-gray-200 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-300 transition font-semibold"
                        >
                            Cancel
                        </button>
                    </div>
                </form>

                {/* Date Tips */}
                <div className="mt-8 p-4 bg-blue-50 rounded-lg">
                    <h3 className="font-semibold text-blue-800 mb-2">📅 Date Tips:</h3>
                    <ul className="text-sm text-blue-700 space-y-1">
                        <li>• Set start date in the past for immediate voting</li>
                        <li>• Set end date in the future for ongoing election</li>
                        <li>• Format: YYYY-MM-DD HH:MM (24-hour)</li>
                    </ul>
                </div>
            </motion.div>
        </div>
    );
};

export default CreateElection;