import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaUser, FaEnvelope, FaLock, FaCalendarAlt, FaIdCard, FaUpload, FaPhone, FaEye, FaEyeSlash } from 'react-icons/fa';
import toast from 'react-hot-toast';
import { register as apiRegister, verifyOtp, resendOtp } from '../services/api';

const Register = () => {
  const [step, setStep] = useState(1);
  const [userId, setUserId] = useState('');
  const [formData, setFormData] = useState({
    firstName: 'Dilip',
    middleName: 'Shivpujan',
    lastName: 'Maurya',
    email: 'dm143dilip@gmail.com',
    mobileNumber: '7350541586',
    password: 'Dilip@123456',
    confirmPassword: 'Dilip@123456',
    dateOfBirth: '2000-01-02',
    aadharNumber: '152516280629',
    aadharImage: null,
    street: 'Maharashtra Housing Board Society',
    city: 'Pune',
    state: 'Maharashtra',
    pincode: '411006',
    country: 'India'
  });

  const [errors, setErrors] = useState({});
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (errors[e.target.name]) {
      setErrors({ ...errors, [e.target.name]: '' });
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        return toast.error('File size must be less than 5MB');
      }
      const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'application/pdf'];
      if (!allowedTypes.includes(file.type)) {
        return toast.error('Only JPEG, PNG and PDF files are allowed');
      }
      setFormData({ ...formData, aadharImage: file });
      if (errors.aadharImage) {
        setErrors({ ...errors, aadharImage: '' });
      }
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.firstName.trim()) newErrors.firstName = 'First name is required';
    if (!formData.lastName.trim()) newErrors.lastName = 'Last name is required';

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }

    if (!formData.mobileNumber.trim()) {
      newErrors.mobileNumber = 'Mobile number is required';
    } else if (!/^\d{10}$/.test(formData.mobileNumber)) {
      newErrors.mobileNumber = 'Mobile number must be 10 digits';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else {
      const passwordErrors = [];
      if (formData.password.length < 8) {
        passwordErrors.push('at least 8 characters');
      }
      if (!/[A-Z]/.test(formData.password)) {
        passwordErrors.push('one uppercase letter');
      }
      if (!/[a-z]/.test(formData.password)) {
        passwordErrors.push('one lowercase letter');
      }
      if (!/[0-9]/.test(formData.password)) {
        passwordErrors.push('one number');
      }
      if (!/[!@#$%^&*]/.test(formData.password)) {
        passwordErrors.push('one special character');
      }

      if (passwordErrors.length > 0) {
        newErrors.password = `Password must contain ${passwordErrors.join(', ')}`;
      }
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    if (!formData.dateOfBirth) newErrors.dateOfBirth = 'Date of birth is required';

    if (!formData.aadharNumber) {
      newErrors.aadharNumber = 'Aadhar number is required';
    } else if (!/^\d{12}$/.test(formData.aadharNumber)) {
      newErrors.aadharNumber = 'Aadhar number must be 12 digits';
    }

    // ✅ FIXED: Address validation
    if (!formData.street.trim()) newErrors.street = 'Street address is required';
    if (!formData.city.trim()) newErrors.city = 'City is required';
    if (!formData.state.trim()) newErrors.state = 'State is required';
    if (!formData.pincode.trim()) {
      newErrors.pincode = 'Pincode is required';
    } else if (!/^\d{6}$/.test(formData.pincode)) {
      newErrors.pincode = 'Pincode must be 6 digits';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validatePassword = (password) => {
    const errors = [];

    if (password.length < 8) errors.push('Password must be at least 8 characters long');
    if (!/[A-Z]/.test(password)) errors.push('Password must contain at least one uppercase letter');
    if (!/[a-z]/.test(password)) errors.push('Password must contain at least one lowercase letter');
    if (!/[0-9]/.test(password)) errors.push('Password must contain at least one number');
    if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
      errors.push('Password must contain at least one special character (!@#$%^&* etc.)');
    }

    return { isValid: errors.length === 0, errors };
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    try {
      let formattedDate = formData.dateOfBirth;
      if (formData.dateOfBirth) {
        if (formData.dateOfBirth.includes('-')) {
          formattedDate = formData.dateOfBirth;
        } else {
          const date = new Date(formData.dateOfBirth);
          if (!isNaN(date.getTime())) {
            formattedDate = date.toISOString().split('T')[0];
          }
        }
      }

      const passwordCheck = validatePassword(formData.password);
      if (!passwordCheck.isValid) {
        passwordCheck.errors.forEach(error => toast.error(error));
        setLoading(false);
        return;
      }

      const data = new FormData();
      data.append('firstName', formData.firstName);
      data.append('middleName', formData.middleName);
      data.append('lastName', formData.lastName);
      data.append('email', formData.email);
      data.append('mobileNumber', formData.mobileNumber);
      data.append('password', formData.password);
      data.append('dateOfBirth', formattedDate);
      data.append('aadharNumber', formData.aadharNumber);
      data.append('aadharImage', formData.aadharImage);
      data.append('street', formData.street);
      data.append('city', formData.city);
      data.append('state', formData.state);
      data.append('pincode', formData.pincode);
      data.append('country', formData.country);

      // FormData create karne ke baad (line ~190 ke aas paas)
      console.log("📤 FormData entries being sent:");
      for (let pair of data.entries()) {
        console.log(pair[0], pair[1]);
      }
      
      const response = await apiRegister(data);
      toast.success(response.data.msg);
      setUserId(response.data.userId);
      setStep(2);


    } catch (error) {
      if (error.response?.data?.error === 'AGE_RESTRICTION') {
        toast.error(`❌ ${error.response.data.msg} (Your age: ${error.response.data.yourAge})`);
      } else {
        toast.error(error.response?.data?.msg || 'Registration failed');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async () => {
    if (!otp || otp.length !== 6) return toast.error('Please enter 6-digit OTP');
    setLoading(true);
    try {
      const response = await verifyOtp({ userId, otp });
      toast.success(response.data.msg);
      setTimeout(() => navigate('/login'), 1500);
    } catch (error) {
      toast.error(error.response?.data?.msg || 'OTP verification failed');
    } finally {
      setLoading(false);
    }
  };

  const handleResendOtp = async () => {
    setLoading(true);
    try {
      const response = await resendOtp({ userId });
      toast.success(response.data.msg);
    } catch (error) {
      toast.error(error.response?.data?.msg || 'Failed to resend OTP');
    } finally {
      setLoading(false);
    }
  };

  if (step === 2) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 to-primary-100 py-12 px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-md w-full bg-white rounded-2xl shadow-2xl p-8"
        >
          <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">Verify Your Email</h2>
          <p className="text-gray-600 text-center mb-6">
            We've sent a 6-digit OTP to <strong>{formData.email}</strong>
          </p>
          <input
            type="text"
            maxLength="6"
            placeholder="Enter OTP"
            value={otp}
            onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg text-center text-2xl tracking-widest"
          />
          <div className="flex gap-4 mt-6">
            <button
              onClick={handleVerifyOtp}
              disabled={loading}
              className="flex-1 bg-primary-600 text-white py-3 rounded-lg hover:bg-primary-700 font-semibold"
            >
              {loading ? 'Verifying...' : 'Verify OTP'}
            </button>
            <button
              onClick={handleResendOtp}
              disabled={loading}
              className="px-4 py-2 border border-primary-600 text-primary-600 rounded-lg hover:bg-primary-50"
            >
              Resend
            </button>
          </div>
          <p className="text-center mt-4 text-sm text-gray-500">
            Didn't receive OTP? Check spam folder.
          </p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-primary-100 py-12">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-3xl mx-auto bg-white rounded-2xl shadow-2xl overflow-hidden"
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-primary-600 to-primary-800 px-8 py-6 text-white">
            <h2 className="text-3xl font-bold">Create Account</h2>
            <p className="text-primary-100 mt-1">Join our secure voting system</p>
          </div>

          {/* Form */}
          <form onSubmit={handleRegister} encType="multipart/form-data" className="p-8">
            {/* Name Section - 3 Columns */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div>
                <label className="block text-gray-700 font-medium mb-2">First Name <span className="text-red-500">*</span></label>
                <div className="relative">
                  <FaUser className="absolute left-3 top-3 text-gray-400" />
                  <input type="text" name="firstName" value={formData.firstName} onChange={handleChange}
                    className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 ${errors.firstName ? 'border-red-500' : 'border-gray-300'}`}
                    placeholder="First name" />
                </div>
                {errors.firstName && <p className="text-red-500 text-xs mt-1">{errors.firstName}</p>}
              </div>
              <div>
                <label className="block text-gray-700 font-medium mb-2">Middle Name</label>
                <div className="relative">
                  <FaUser className="absolute left-3 top-3 text-gray-400" />
                  <input type="text" name="middleName" value={formData.middleName} onChange={handleChange}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                    placeholder="Middle name" />
                </div>
              </div>
              <div>
                <label className="block text-gray-700 font-medium mb-2">Last Name <span className="text-red-500">*</span></label>
                <div className="relative">
                  <FaUser className="absolute left-3 top-3 text-gray-400" />
                  <input type="text" name="lastName" value={formData.lastName} onChange={handleChange}
                    className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 ${errors.lastName ? 'border-red-500' : 'border-gray-300'}`}
                    placeholder="Last name" />
                </div>
                {errors.lastName && <p className="text-red-500 text-xs mt-1">{errors.lastName}</p>}
              </div>
            </div>

            {/* Contact Section - 2 Columns */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div>
                <label className="block text-gray-700 font-medium mb-2">Email Address <span className="text-red-500">*</span></label>
                <div className="relative">
                  <FaEnvelope className="absolute left-3 top-3 text-gray-400" />
                  <input type="email" name="email" value={formData.email} onChange={handleChange}
                    className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 ${errors.email ? 'border-red-500' : 'border-gray-300'}`}
                    placeholder="Enter your email" />
                </div>
                {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
              </div>
              <div>
                <label className="block text-gray-700 font-medium mb-2">Mobile Number <span className="text-red-500">*</span></label>
                <div className="relative">
                  <FaPhone className="absolute left-3 top-3 text-gray-400" />
                  <input type="tel" name="mobileNumber" maxLength="10" value={formData.mobileNumber} onChange={handleChange}
                    className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 ${errors.mobileNumber ? 'border-red-500' : 'border-gray-300'}`}
                    placeholder="10 digit mobile number" />
                </div>
                {errors.mobileNumber && <p className="text-red-500 text-xs mt-1">{errors.mobileNumber}</p>}
              </div>
            </div>

            {/* Password Section - 2 Columns */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              {/* Password Field */}
              <div>
                <label className="block text-gray-700 font-medium mb-2">Password <span className="text-red-500">*</span></label>
                <div className="relative">
                  <FaLock className="absolute left-3 top-3 text-gray-400" />
                  <input type={showPassword ? "text" : "password"} name="password" value={formData.password} onChange={handleChange}
                    className={`w-full pl-10 pr-12 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 ${errors.password ? 'border-red-500' : 'border-gray-300'}`}
                    placeholder="Min. 8 chars, 1 uppercase, 1 number, 1 special" />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-3 text-gray-400 hover:text-gray-600 focus:outline-none">
                    {showPassword ? <FaEyeSlash size={20} /> : <FaEye size={20} />}
                  </button>
                </div>
                {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password}</p>}
                {/* Password Strength Indicator */}
                {formData.password && (
                  <div className="mt-3 space-y-2">
                    <div className="flex gap-1">
                      <div className={`h-1.5 flex-1 rounded-full transition-all duration-300 ${formData.password.length >= 8 ? 'bg-green-500' : 'bg-gray-300'}`} />
                      <div className={`h-1.5 flex-1 rounded-full transition-all duration-300 ${/[A-Z]/.test(formData.password) ? 'bg-green-500' : 'bg-gray-300'}`} />
                      <div className={`h-1.5 flex-1 rounded-full transition-all duration-300 ${/[a-z]/.test(formData.password) ? 'bg-green-500' : 'bg-gray-300'}`} />
                      <div className={`h-1.5 flex-1 rounded-full transition-all duration-300 ${/[0-9]/.test(formData.password) ? 'bg-green-500' : 'bg-gray-300'}`} />
                      <div className={`h-1.5 flex-1 rounded-full transition-all duration-300 ${/[!@#$%^&*]/.test(formData.password) ? 'bg-green-500' : 'bg-gray-300'}`} />
                    </div>
                    <ul className="text-xs space-y-1">
                      <li className={formData.password.length >= 8 ? 'text-green-600' : 'text-gray-400'}>✓ At least 8 characters</li>
                      <li className={/[A-Z]/.test(formData.password) ? 'text-green-600' : 'text-gray-400'}>✓ One uppercase letter (A-Z)</li>
                      <li className={/[a-z]/.test(formData.password) ? 'text-green-600' : 'text-gray-400'}>✓ One lowercase letter (a-z)</li>
                      <li className={/[0-9]/.test(formData.password) ? 'text-green-600' : 'text-gray-400'}>✓ One number (0-9)</li>
                      <li className={/[!@#$%^&*]/.test(formData.password) ? 'text-green-600' : 'text-gray-400'}>✓ One special character (!@#$%^&*)</li>
                    </ul>
                  </div>
                )}
              </div>
              {/* Confirm Password Field */}
              <div>
                <label className="block text-gray-700 font-medium mb-2">Confirm Password <span className="text-red-500">*</span></label>
                <div className="relative">
                  <FaLock className="absolute left-3 top-3 text-gray-400" />
                  <input type={showConfirmPassword ? "text" : "password"} name="confirmPassword" value={formData.confirmPassword} onChange={handleChange}
                    className={`w-full pl-10 pr-12 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 ${errors.confirmPassword ? 'border-red-500' : 'border-gray-300'}`}
                    placeholder="Re-enter password" />
                  <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="absolute right-3 top-3 text-gray-400 hover:text-gray-600 focus:outline-none">
                    {showConfirmPassword ? <FaEyeSlash size={20} /> : <FaEye size={20} />}
                  </button>
                </div>
                {errors.confirmPassword && <p className="text-red-500 text-xs mt-1">{errors.confirmPassword}</p>}
              </div>
            </div>

            {/* Identity Section - 2 Columns */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div>
                <label className="block text-gray-700 font-medium mb-2">Date of Birth <span className="text-red-500">*</span></label>
                <div className="relative">
                  <FaCalendarAlt className="absolute left-3 top-3 text-gray-400" />
                  <input type="date" name="dateOfBirth" value={formData.dateOfBirth} onChange={handleChange}
                    className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 ${errors.dateOfBirth ? 'border-red-500' : 'border-gray-300'}`} />
                </div>
                {errors.dateOfBirth && <p className="text-red-500 text-xs mt-1">{errors.dateOfBirth}</p>}
              </div>
              <div>
                <label className="block text-gray-700 font-medium mb-2">Aadhar Number <span className="text-red-500">*</span></label>
                <div className="relative">
                  <FaIdCard className="absolute left-3 top-3 text-gray-400" />
                  <input type="text" name="aadharNumber" maxLength="12" value={formData.aadharNumber} onChange={handleChange}
                    className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 ${errors.aadharNumber ? 'border-red-500' : 'border-gray-300'}`}
                    placeholder="12 digit Aadhar number" />
                </div>
                {errors.aadharNumber && <p className="text-red-500 text-xs mt-1">{errors.aadharNumber}</p>}
              </div>
            </div>

            {/* Address Section */}
            <div className="col-span-2">
              <h3 className="text-lg font-semibold text-gray-700 mb-3">Address Information</h3>
            </div>

            {/* Street Address */}
            <div className="col-span-2 mb-4">
              <label className="block text-gray-700 font-medium mb-2">Street Address <span className="text-red-500">*</span></label>
              <input type="text" name="street" value={formData.street} onChange={handleChange}
                className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 ${errors.street ? 'border-red-500' : 'border-gray-300'}`}
                placeholder="Enter your street address" />
              {errors.street && <p className="text-red-500 text-xs mt-1">{errors.street}</p>}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <div>
                <label className="block text-gray-700 font-medium mb-2">City <span className="text-red-500">*</span></label>
                <input type="text" name="city" value={formData.city} onChange={handleChange}
                  className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 ${errors.city ? 'border-red-500' : 'border-gray-300'}`}
                  placeholder="City" />
                {errors.city && <p className="text-red-500 text-xs mt-1">{errors.city}</p>}
              </div>
              <div>
                <label className="block text-gray-700 font-medium mb-2">State <span className="text-red-500">*</span></label>
                <input type="text" name="state" value={formData.state} onChange={handleChange}
                  className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 ${errors.state ? 'border-red-500' : 'border-gray-300'}`}
                  placeholder="State" />
                {errors.state && <p className="text-red-500 text-xs mt-1">{errors.state}</p>}
              </div>
              <div>
                <label className="block text-gray-700 font-medium mb-2">Pincode <span className="text-red-500">*</span></label>
                <input type="text" name="pincode" value={formData.pincode} onChange={handleChange} maxLength="6" pattern="\d*"
                  className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 ${errors.pincode ? 'border-red-500' : 'border-gray-300'}`}
                  placeholder="6 digit pincode" />
                {errors.pincode && <p className="text-red-500 text-xs mt-1">{errors.pincode}</p>}
              </div>
            </div>

            {/* Country */}
            <div className="col-span-2 mb-4">
              <label className="block text-gray-700 font-medium mb-2">Country</label>
              <input type="text" name="country" value={formData.country} onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                placeholder="Country" />
            </div>

            {/* Document Upload */}
            <div className="mb-6">
              <label className="block text-gray-700 font-medium mb-2">Upload Aadhar <span className="text-red-500">*</span></label>
              <div className="relative">
                <FaUpload className="absolute left-3 top-3 text-gray-400" />
                <input type="file" name="aadharImage" accept=".jpg,.jpeg,.png,.pdf" onChange={handleFileChange}
                  className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 ${errors.aadharImage ? 'border-red-500' : 'border-gray-300'}`} />
              </div>
              <p className="text-xs text-gray-500 mt-1">Accepted formats: JPEG, PNG, PDF (Max 5MB)</p>
              {errors.aadharImage && <p className="text-red-500 text-xs mt-1">{errors.aadharImage}</p>}
            </div>

            {/* Submit Button */}
            <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
              type="submit" disabled={loading}
              className="w-full bg-primary-600 text-white px-6 py-4 rounded-lg hover:bg-primary-700 font-semibold text-lg transition duration-300">
              {loading ? 'Registering...' : 'Create Account'}
            </motion.button>

            {/* Login Link */}
            <p className="text-center mt-6 text-gray-600">
              Already have an account?{' '}
              <Link to="/login" className="text-primary-600 hover:underline font-semibold">
                Sign in here
              </Link>
            </p>
          </form>
        </motion.div>
      </div>
    </div>
  );
};

export default Register;