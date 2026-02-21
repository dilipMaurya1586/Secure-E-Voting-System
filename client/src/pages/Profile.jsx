import React, { useState, useContext, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaUser, FaEnvelope, FaIdCard, FaCalendar, FaCheckCircle, FaTimesCircle } from 'react-icons/fa';
import AuthContext from '../context/AuthContext';
import { fetchUser } from '../services/api';
import toast from 'react-hot-toast';

const Profile = () => {
  const { user } = useContext(AuthContext);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadUserData();
  }, []);

  const loadUserData = async () => {
    try {
      const response = await fetchUser();
      setUserData(response.data);
    } catch (error) {
      toast.error('Failed to load profile');
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

  const profileData = userData || user;

  return (
    <div className="container mx-auto px-4 py-8 max-w-3xl">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-2xl shadow-2xl overflow-hidden"
      >
        {/* Profile Header */}
        <div className="bg-gradient-to-r from-primary-600 to-primary-800 px-8 py-12 text-white">
          <div className="flex items-center space-x-6">
            <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center">
              <FaUser className="text-5xl text-primary-600" />
            </div>
            <div>
              <h1 className="text-3xl font-bold">{profileData?.name}</h1>
              <p className="text-xl opacity-90 capitalize">{profileData?.role}</p>
            </div>
          </div>
        </div>

        {/* Profile Details */}
        <div className="p-8 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Email */}
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="flex items-center space-x-3">
                <FaEnvelope className="text-2xl text-primary-600" />
                <div>
                  <p className="text-sm text-gray-600">Email Address</p>
                  <p className="font-semibold">{profileData?.email}</p>
                </div>
              </div>
            </div>

            {/* User ID */}
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="flex items-center space-x-3">
                <FaIdCard className="text-2xl text-primary-600" />
                <div>
                  <p className="text-sm text-gray-600">User ID</p>
                  <p className="font-semibold text-sm">{profileData?.id || profileData?._id}</p>
                </div>
              </div>
            </div>

            {/* Role */}
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="flex items-center space-x-3">
                <FaUser className="text-2xl text-primary-600" />
                <div>
                  <p className="text-sm text-gray-600">Role</p>
                  <p className="font-semibold capitalize">{profileData?.role}</p>
                </div>
              </div>
            </div>

            {/* Verification Status */}
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="flex items-center space-x-3">
                {profileData?.isVerified ? (
                  <FaCheckCircle className="text-2xl text-green-600" />
                ) : (
                  <FaTimesCircle className="text-2xl text-yellow-600" />
                )}
                <div>
                  <p className="text-sm text-gray-600">Verification Status</p>
                  <p className={`font-semibold ${profileData?.isVerified ? 'text-green-600' : 'text-yellow-600'}`}>
                    {profileData?.isVerified ? 'Verified' : 'Pending'}
                  </p>
                </div>
              </div>
            </div>

            {/* Member Since */}
            {profileData?.createdAt && (
              <div className="bg-gray-50 rounded-lg p-4 md:col-span-2">
                <div className="flex items-center space-x-3">
                  <FaCalendar className="text-2xl text-primary-600" />
                  <div>
                    <p className="text-sm text-gray-600">Member Since</p>
                    <p className="font-semibold">
                      {new Date(profileData.createdAt).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Account Stats (for voters) */}
          {profileData?.role === 'voter' && (
            <div className="mt-8 pt-6 border-t border-gray-200">
              <h2 className="text-xl font-bold mb-4">Voting Statistics</h2>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-blue-50 rounded-lg p-4 text-center">
                  <p className="text-2xl font-bold text-blue-600">0</p>
                  <p className="text-gray-600">Elections Participated</p>
                </div>
                <div className="bg-green-50 rounded-lg p-4 text-center">
                  <p className="text-2xl font-bold text-green-600">0</p>
                  <p className="text-gray-600">Votes Cast</p>
                </div>
              </div>
            </div>
          )}

          {/* Admin Stats */}
          {profileData?.role === 'admin' && (
            <div className="mt-8 pt-6 border-t border-gray-200">
              <h2 className="text-xl font-bold mb-4">Admin Information</h2>
              <div className="bg-purple-50 rounded-lg p-4">
                <p className="text-purple-800">
                  You have full administrative privileges to manage elections, candidates, and voters.
                </p>
              </div>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default Profile;