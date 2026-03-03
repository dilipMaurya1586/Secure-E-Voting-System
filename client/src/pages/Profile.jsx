import React, { useState, useEffect, useContext } from 'react';
import { motion } from 'framer-motion';
import {
  FaUser, FaEnvelope, FaPhone, FaCalendarAlt, FaIdCard,
  FaMapMarkerAlt, FaCity, FaGlobe, FaCheckCircle,
  FaTimesCircle, FaClock, FaShieldAlt, FaAddressCard
} from 'react-icons/fa';
import AuthContext from '../context/AuthContext';
import { fetchUser } from '../services/api';
import toast from 'react-hot-toast';

const Profile = () => {
  const { user: authUser } = useContext(AuthContext);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadUserProfile();
  }, []);

  const loadUserProfile = async () => {
    try {
      const response = await fetchUser();
      setUser(response.data);
    } catch (error) {
      toast.error('Failed to load profile');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-primary-200 border-t-primary-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading profile...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center bg-white p-8 rounded-2xl shadow-xl">
          <FaTimesCircle className="text-6xl text-red-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Profile Not Found</h2>
          <p className="text-gray-600">Unable to load your profile information.</p>
        </div>
      </div>
    );
  }

  const joinDate = new Date(user.createdAt).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  const fullName = `${user.firstName} ${user.middleName || ''} ${user.lastName}`.trim();

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8">
      <div className="container mx-auto px-4 max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* Header with Cover */}
          <div className="relative h-48 rounded-2xl overflow-hidden mb-8">
            <div className="absolute inset-0 bg-gradient-to-r from-primary-800 via-primary-600 to-primary-800">
              <div className="absolute inset-0 bg-black opacity-10"></div>
            </div>
            <div className="absolute bottom-0 left-0 right-0 p-8 text-white">
              <h1 className="text-4xl font-bold mb-2">My Profile</h1>
              <p className="text-primary-100 text-lg">Your personal information and account details</p>
            </div>
          </div>

          {/* Main Content Grid - Left and Right Split */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column - Profile Summary & Stats */}
            <div className="lg:col-span-1">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-white rounded-2xl shadow-xl overflow-hidden sticky top-8"
              >
                {/* Profile Header */}
                <div className="bg-gradient-to-br from-primary-600 to-primary-800 p-6 text-center">
                  <div className="w-24 h-24 bg-white rounded-full mx-auto mb-4 flex items-center justify-center shadow-lg">
                    <FaUser className="text-4xl text-primary-600" />
                  </div>
                  <h2 className="text-xl font-bold text-white">{fullName}</h2>
                  <p className="text-primary-100 text-sm capitalize">{user.role}</p>
                </div>

                {/* Quick Stats */}
                <div className="p-6 space-y-4">
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-2">
                      <FaClock className="text-primary-600" />
                      <span className="text-gray-600">Member Since</span>
                    </div>
                    <span className="font-semibold">{joinDate}</span>
                  </div>

                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-2">
                      <FaShieldAlt className="text-primary-600" />
                      <span className="text-gray-600">User ID</span>
                    </div>
                  
                    {/* After: */}
                    <span className="font-mono text-sm font-bold text-primary-600">
                      {user.customUserId || `WZS${Math.floor(1000000 + Math.random() * 9000000)}`}
                    </span>
                  </div>

                  {/* Verification Badges */}
                  <div className="pt-4 border-t">
                    <h3 className="font-semibold mb-3">Verification Status</h3>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        {user.isEmailVerified ? (
                          <FaCheckCircle className="text-green-500" />
                        ) : (
                          <FaTimesCircle className="text-yellow-500" />
                        )}
                        <span className="text-sm">Email {user.isEmailVerified ? 'Verified' : 'Pending'}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        {user.isDocumentVerified ? (
                          <FaCheckCircle className="text-green-500" />
                        ) : (
                          <FaTimesCircle className="text-yellow-500" />
                        )}
                        <span className="text-sm">Documents {user.isDocumentVerified ? 'Verified' : 'Pending'}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        {user.isVerified ? (
                          <FaCheckCircle className="text-green-500" />
                        ) : (
                          <FaTimesCircle className="text-yellow-500" />
                        )}
                        <span className="text-sm">Account {user.isVerified ? 'Active' : 'Pending'}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Right Column - Detailed Information */}
            <div className="lg:col-span-2 space-y-6">
              {/* Personal Information Card */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="bg-white rounded-2xl shadow-xl overflow-hidden"
              >
                <div className="bg-gradient-to-r from-gray-50 to-gray-100 px-6 py-4 border-b">
                  <h2 className="text-xl font-semibold flex items-center gap-2">
                    <FaUser className="text-primary-600" />
                    Personal Information
                  </h2>
                </div>
                <div className="p-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="text-sm text-gray-500">Full Name</label>
                      <p className="font-medium text-gray-800 mt-1">{fullName}</p>
                    </div>
                    <div>
                      <label className="text-sm text-gray-500">Email Address</label>
                      <p className="font-medium text-gray-800 mt-1 flex items-center gap-2">
                        <FaEnvelope className="text-primary-600" />
                        {user.email}
                      </p>
                    </div>
                    <div>
                      <label className="text-sm text-gray-500">Mobile Number</label>
                      <p className="font-medium text-gray-800 mt-1 flex items-center gap-2">
                        <FaPhone className="text-primary-600" />
                        {user.mobileNumber}
                      </p>
                    </div>
                    <div>
                      <label className="text-sm text-gray-500">Date of Birth</label>
                      <p className="font-medium text-gray-800 mt-1 flex items-center gap-2">
                        <FaCalendarAlt className="text-primary-600" />
                        {new Date(user.dateOfBirth).toLocaleDateString('en-US', {
                          day: 'numeric',
                          month: 'long',
                          year: 'numeric'
                        })}
                      </p>
                    </div>
                    <div className="md:col-span-2">
                      <label className="text-sm text-gray-500">Aadhar Number</label>
                      <p className="font-medium text-gray-800 mt-1 flex items-center gap-2">
                        <FaIdCard className="text-primary-600" />
                        {user.aadharNumber}
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Address Information Card */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="bg-white rounded-2xl shadow-xl overflow-hidden"
              >
                <div className="bg-gradient-to-r from-gray-50 to-gray-100 px-6 py-4 border-b">
                  <h2 className="text-xl font-semibold flex items-center gap-2">
                    <FaAddressCard className="text-primary-600" />
                    Address Information
                  </h2>
                </div>
                <div className="p-6">
                  {user.address ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="md:col-span-2">
                        <label className="text-sm text-gray-500">Street Address</label>
                        <p className="font-medium text-gray-800 mt-1 flex items-center gap-2">
                          <FaMapMarkerAlt className="text-primary-600" />
                          {user.address.street}
                        </p>
                      </div>
                      <div>
                        <label className="text-sm text-gray-500">City</label>
                        <p className="font-medium text-gray-800 mt-1 flex items-center gap-2">
                          <FaCity className="text-primary-600" />
                          {user.address.city}
                        </p>
                      </div>
                      <div>
                        <label className="text-sm text-gray-500">State</label>
                        <p className="font-medium text-gray-800 mt-1">{user.address.state}</p>
                      </div>
                      <div>
                        <label className="text-sm text-gray-500">Pincode</label>
                        <p className="font-medium text-gray-800 mt-1">{user.address.pincode}</p>
                      </div>
                      <div>
                        <label className="text-sm text-gray-500">Country</label>
                        <p className="font-medium text-gray-800 mt-1 flex items-center gap-2">
                          <FaGlobe className="text-primary-600" />
                          {user.address.country || 'India'}
                        </p>
                      </div>
                    </div>
                  ) : (
                    <p className="text-gray-500 text-center py-8">No address information available</p>
                  )}
                </div>
              </motion.div>

              {/* Voting Statistics Card */}
              {user.role === 'voter' && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                  className="bg-white rounded-2xl shadow-xl overflow-hidden"
                >
                  <div className="bg-gradient-to-r from-gray-50 to-gray-100 px-6 py-4 border-b">
                    <h2 className="text-xl font-semibold">📊 Voting Statistics</h2>
                  </div>
                  <div className="p-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-6 text-white">
                        <p className="text-3xl font-bold mb-1">0</p>
                        <p className="text-sm opacity-90">Elections Participated</p>
                      </div>
                      <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl p-6 text-white">
                        <p className="text-3xl font-bold mb-1">0</p>
                        <p className="text-sm opacity-90">Votes Cast</p>
                      </div>
                      <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl p-6 text-white">
                        <p className="text-3xl font-bold mb-1">0%</p>
                        <p className="text-sm opacity-90">Participation Rate</p>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Profile;

// import React, { useState, useContext, useEffect } from 'react';
// import { motion } from 'framer-motion';
// import { FaUser, FaEnvelope, FaIdCard, FaCalendar, FaCheckCircle, FaTimesCircle } from 'react-icons/fa';
// import AuthContext from '../context/AuthContext';
// import { fetchUser } from '../services/api';
// import toast from 'react-hot-toast';

// const Profile = () => {
//   const { user } = useContext(AuthContext);
//   const [userData, setUserData] = useState(null);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     loadUserData();
//   }, []);

//   const loadUserData = async () => {
//     try {
//       const response = await fetchUser();
//       setUserData(response.data);
//     } catch (error) {
//       toast.error('Failed to load profile');
//     } finally {
//       setLoading(false);
//     }
//   };

//   if (loading) {
//     return (
//       <div className="flex justify-center items-center h-64">
//         <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-primary-600"></div>
//       </div>
//     );
//   }

//   const profileData = userData || user;

//   return (
//     <div className="container mx-auto px-4 py-8 max-w-3xl">
//       <motion.div
//         initial={{ opacity: 0, y: 20 }}
//         animate={{ opacity: 1, y: 0 }}
//         className="bg-white rounded-2xl shadow-2xl overflow-hidden"
//       >
//         {/* Profile Header */}
//         <div className="bg-gradient-to-r from-primary-600 to-primary-800 px-8 py-12 text-white">
//           <div className="flex items-center space-x-6">
//             <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center">
//               <FaUser className="text-5xl text-primary-600" />
//             </div>
//             <div>
//               <h1 className="text-3xl font-bold">{profileData?.name}</h1>
//               <p className="text-xl opacity-90 capitalize">{profileData?.role}</p>
//             </div>
//           </div>
//         </div>

//         {/* Profile Details */}
//         <div className="p-8 space-y-6">
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//             {/* Email */}
//             <div className="bg-gray-50 rounded-lg p-4">
//               <div className="flex items-center space-x-3">
//                 <FaEnvelope className="text-2xl text-primary-600" />
//                 <div>
//                   <p className="text-sm text-gray-600">Email Address</p>
//                   <p className="font-semibold">{profileData?.email}</p>
//                 </div>
//               </div>
//             </div>

//             {/* User ID */}
//             <div className="bg-gray-50 rounded-lg p-4">
//               <div className="flex items-center space-x-3">
//                 <FaIdCard className="text-2xl text-primary-600" />
//                 <div>
//                   <p className="text-sm text-gray-600">User ID</p>
//                   <p className="font-semibold text-sm">{profileData?.id || profileData?._id}</p>
//                 </div>
//               </div>
//             </div>

//             {/* Role */}
//             <div className="bg-gray-50 rounded-lg p-4">
//               <div className="flex items-center space-x-3">
//                 <FaUser className="text-2xl text-primary-600" />
//                 <div>
//                   <p className="text-sm text-gray-600">Role</p>
//                   <p className="font-semibold capitalize">{profileData?.role}</p>
//                 </div>
//               </div>
//             </div>

//             {/* Verification Status */}
//             <div className="bg-gray-50 rounded-lg p-4">
//               <div className="flex items-center space-x-3">
//                 {profileData?.isVerified ? (
//                   <FaCheckCircle className="text-2xl text-green-600" />
//                 ) : (
//                   <FaTimesCircle className="text-2xl text-yellow-600" />
//                 )}
//                 <div>
//                   <p className="text-sm text-gray-600">Verification Status</p>
//                   <p className={`font-semibold ${profileData?.isVerified ? 'text-green-600' : 'text-yellow-600'}`}>
//                     {profileData?.isVerified ? 'Verified' : 'Pending'}
//                   </p>
//                 </div>
//               </div>
//             </div>

//             {/* Member Since */}
//             {profileData?.createdAt && (
//               <div className="bg-gray-50 rounded-lg p-4 md:col-span-2">
//                 <div className="flex items-center space-x-3">
//                   <FaCalendar className="text-2xl text-primary-600" />
//                   <div>
//                     <p className="text-sm text-gray-600">Member Since</p>
//                     <p className="font-semibold">
//                       {new Date(profileData.createdAt).toLocaleDateString('en-US', {
//                         year: 'numeric',
//                         month: 'long',
//                         day: 'numeric'
//                       })}
//                     </p>
//                   </div>
//                 </div>
//               </div>
//             )}
//           </div>

//           {/* Account Stats (for voters) */}
//           {profileData?.role === 'voter' && (
//             <div className="mt-8 pt-6 border-t border-gray-200">
//               <h2 className="text-xl font-bold mb-4">Voting Statistics</h2>
//               <div className="grid grid-cols-2 gap-4">
//                 <div className="bg-blue-50 rounded-lg p-4 text-center">
//                   <p className="text-2xl font-bold text-blue-600">0</p>
//                   <p className="text-gray-600">Elections Participated</p>
//                 </div>
//                 <div className="bg-green-50 rounded-lg p-4 text-center">
//                   <p className="text-2xl font-bold text-green-600">0</p>
//                   <p className="text-gray-600">Votes Cast</p>
//                 </div>
//               </div>
//             </div>
//           )}

//           {/* Admin Stats */}
//           {profileData?.role === 'admin' && (
//             <div className="mt-8 pt-6 border-t border-gray-200">
//               <h2 className="text-xl font-bold mb-4">Admin Information</h2>
//               <div className="bg-purple-50 rounded-lg p-4">
//                 <p className="text-purple-800">
//                   You have full administrative privileges to manage elections, candidates, and voters.
//                 </p>
//               </div>
//             </div>
//           )}
//         </div>
//       </motion.div>
//     </div>
//   );
// };

// export default Profile;