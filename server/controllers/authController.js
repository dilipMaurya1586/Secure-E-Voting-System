const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { validationResult } = require('express-validator');
// ✅ NEW: Import utilities
const { validateAge } = require('../utils/validators');
// const { generateOTP, sendOTP } = require('../utils/email');
const { generateOTP, sendOTP } = require('../utils/resendEmail');


// ✅ Strong password validation function
const validatePasswordStrength = (password) => {
  const errors = [];

  if (password.length < 8) {
    errors.push('Password must be at least 8 characters long');
  }
  if (!/[A-Z]/.test(password)) {
    errors.push('Password must contain at least one uppercase letter');
  }
  if (!/[a-z]/.test(password)) {
    errors.push('Password must contain at least one lowercase letter');
  }
  if (!/[0-9]/.test(password)) {
    errors.push('Password must contain at least one number');
  }
  if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
    errors.push('Password must contain at least one special character');
  }

  return {
    isValid: errors.length === 0,
    errors
  };
};

// @route POST /api/auth/register
// @route POST /api/auth/register
exports.register = async (req, res) => {
  try {
    const { firstName, middleName, lastName, email, mobileNumber, password, dateOfBirth, aadharNumber } = req.body;

    // Validation
    if (!firstName || !lastName || !email || !mobileNumber || !password || !dateOfBirth || !aadharNumber) {
      return res.status(400).json({ msg: 'All required fields must be filled' });
    }

    // ✅ PASSWORD STRENGTH VALIDATION
    const passwordCheck = validatePasswordStrength(password);
    if (!passwordCheck.isValid) {
      return res.status(400).json({
        msg: 'Password does not meet strength requirements',
        errors: passwordCheck.errors
      });
    }

    // Check existing user by email OR aadhar OR mobile
    let existingUser = await User.findOne({
      $or: [{ email }, { aadharNumber }, { mobileNumber }]
    });

    if (existingUser) {
      if (existingUser.email === email) {
        return res.status(400).json({ msg: 'Email already registered' });
      }
      if (existingUser.aadharNumber === aadharNumber) {
        return res.status(400).json({ msg: 'Aadhar number already registered' });
      }
      if (existingUser.mobileNumber === mobileNumber) {
        return res.status(400).json({ msg: 'Mobile number already registered' });
      }
    }

    // ✅ Age validation
    const ageCheck = validateAge(dateOfBirth);
    if (!ageCheck.isValid) {
      return res.status(400).json({
        msg: ageCheck.message,
        error: 'AGE_RESTRICTION',
        yourAge: ageCheck.age
      });
    }

    // ✅ Create user with new fields
    const user = new User({
      firstName,
      middleName,
      lastName,
      email,
      mobileNumber,
      password,
      dateOfBirth,
      aadharNumber,
      aadharImage: req.file ? req.file.path : null,
      isEmailVerified: false,
      isDocumentVerified: false,
      isVerified: false
    });

    // Hash password
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);

    // Generate OTP
    const otp = generateOTP();
    user.otp = otp;
    user.otpExpiry = Date.now() + 10 * 60 * 1000;

    await user.save();

    console.log('✅ User saved with ID:', user._id);
    
    // ✅ 🔥 NEW: Send OTP via Resend API
    try {
      const emailSent = await sendOTP(email, otp);
      if (emailSent) {
        console.log('✅ OTP email sent successfully to:', email);
      } else {
        console.warn('⚠️ OTP email sending failed, but user was created. OTP:', otp);
      }
    } catch (emailError) {
      console.error('❌ Error sending OTP email:', emailError);
      console.log('📧 OTP (fallback - check console):', otp);
    }

    return res.status(201).json({
      msg: 'Registration successful. Please verify your email with OTP.',
      userId: user._id
    });

  } catch (err) {
    console.error('❌ Registration error:', err);
    if (!res.headersSent) {
      return res.status(500).json({ error: err.message });
    }
  }
};
// exports.register = async (req, res) => {
//   try {
//     const { firstName, middleName, lastName, email, mobileNumber, password, dateOfBirth, aadharNumber } = req.body;

//     // Validation
//     if (!firstName || !lastName || !email || !mobileNumber || !password || !dateOfBirth || !aadharNumber) {
//       return res.status(400).json({ msg: 'All required fields must be filled' });
//     }

//     // ✅ PASSWORD STRENGTH VALIDATION
//     const passwordCheck = validatePasswordStrength(password);
//     if (!passwordCheck.isValid) {
//       return res.status(400).json({
//         msg: 'Password does not meet strength requirements',
//         errors: passwordCheck.errors
//       });
//     }

//     // Check existing user by email OR aadhar OR mobile
//     let existingUser = await User.findOne({
//       $or: [{ email }, { aadharNumber }, { mobileNumber }]
//     });

//     if (existingUser) {
//       if (existingUser.email === email) {
//         return res.status(400).json({ msg: 'Email already registered' });
//       }
//       if (existingUser.aadharNumber === aadharNumber) {
//         return res.status(400).json({ msg: 'Aadhar number already registered' });
//       }
//       if (existingUser.mobileNumber === mobileNumber) {
//         return res.status(400).json({ msg: 'Mobile number already registered' });
//       }
//     }

//     // ✅ Age validation
//     const ageCheck = validateAge(dateOfBirth);
//     if (!ageCheck.isValid) {
//       return res.status(400).json({
//         msg: ageCheck.message,
//         error: 'AGE_RESTRICTION',
//         yourAge: ageCheck.age
//       });
//     }

//     // ✅ Create user with new fields
//     const user = new User({
//       firstName,
//       middleName,
//       lastName,
//       email,
//       mobileNumber,
//       password,
//       dateOfBirth,
//       aadharNumber,
//       aadharImage: req.file ? req.file.path : null,
//       isEmailVerified: false,
//       isDocumentVerified: false,
//       isVerified: false
//     });

//     // Hash password
//     const salt = await bcrypt.genSalt(10);
//     user.password = await bcrypt.hash(password, salt);

//     // Generate OTP
//     const otp = generateOTP();
//     user.otp = otp;
//     user.otpExpiry = Date.now() + 10 * 60 * 1000;

//     await user.save();

//     console.log('✅ User saved with ID:', user._id);
//     console.log('📧 OTP (email disabled):', otp);

//     // await sendOTP(email, otp);

//     return res.status(201).json({
//       msg: 'Registration successful. Please verify your email with OTP.',
//       userId: user._id
//     });

//   } catch (err) {
//     console.error('❌ Registration error:', err);
//     if (!res.headersSent) {
//       return res.status(500).json({ error: err.message });
//     }
//   }
// };

// @route POST /api/auth/login
exports.login = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

  const { email, password } = req.body;

  try {
    let user = await User.findOne({ email });
    if (!user) return res.status(400).json({ msg: 'Invalid credentials' });

    // Check if email is verified
    if (!user.isEmailVerified) {
      return res.status(401).json({
        msg: 'Please verify your email first',
        userId: user._id,
        requiresOtp: true
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ msg: 'Invalid credentials' });

    const payload = { user: { id: user.id, role: user.role } };
    jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '7d' }, (err, token) => {
      if (err) throw err;
      res.json({
        token,
        user: {
          id: user.id,
          firstName: user.firstName,
          lastName: user.lastName,
          email,
          role: user.role,
          isEmailVerified: user.isEmailVerified,
          isDocumentVerified: user.isDocumentVerified
        }
      });
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

// @route GET /api/auth/me (protected)
exports.getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    res.json(user);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

// @route POST /api/auth/verify-otp
exports.verifyOtp = async (req, res) => {
  try {
    const { userId, otp } = req.body;
    console.log('🔍 Verify OTP started');
    console.log('User ID:', userId);
    console.log('OTP received:', otp);

    const user = await User.findById(userId);
    if (!user) {
      console.log('❌ User not found');
      return res.status(404).json({ msg: 'User not found' });
    }
    console.log('✅ User found:', user.email);

    if (user.isEmailVerified) {
      console.log('✅ Email already verified');
      return res.json({ msg: 'Email already verified' });
    }

    console.log('📦 OTP from DB:', user.otp);
    console.log('📦 OTP expiry:', user.otpExpiry);
    console.log('📦 Current time:', Date.now());

    if (String(user.otp) !== String(otp)) {
      console.log('❌ OTP mismatch');
      return res.status(400).json({ msg: 'Invalid OTP' });
    }

    if (user.otpExpiry < Date.now()) {
      console.log('❌ OTP expired');
      return res.status(400).json({ msg: 'OTP expired' });
    }

    user.isEmailVerified = true;
    user.otp = undefined;
    user.otpExpiry = undefined;
    await user.save();
    console.log('✅ Email verified successfully');

    const payload = { user: { id: user.id, role: user.role } };
    jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '7d' }, (err, token) => {
      if (err) {
        console.error('❌ JWT error:', err);
        return res.status(500).json({ msg: 'Error generating token' });
      }

      res.json({
        msg: 'Email verified successfully',
        token,
        user: {
          id: user.id,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          role: user.role
        }
      });
    });

  } catch (err) {
    console.error('❌ Error in verifyOtp:', err);
    res.status(500).json({ error: err.message });
  }
};

// @route POST /api/auth/resend-otp
// @route POST /api/auth/resend-otp
exports.resendOtp = async (req, res) => {
  const { userId } = req.body;
  
  console.log('🔄 Resend OTP called for userId:', userId);

  try {
    const user = await User.findById(userId);
    if (!user) {
      console.log('❌ User not found');
      return res.status(404).json({ msg: 'User not found' });
    }

    if (user.isEmailVerified) {
      return res.json({ msg: 'Email already verified' });
    }

    // Generate new OTP
    const otp = generateOTP();
    user.otp = otp;
    user.otpExpiry = Date.now() + 10 * 60 * 1000; // 10 minutes
    await user.save();

    console.log('🔄 New OTP generated:', otp);
    
    // Send via Resend
    const emailSent = await sendOTP(user.email, otp);
    
    if (!emailSent) {
      console.warn('⚠️ Resend email failed, but OTP saved in DB');
      return res.json({ 
        msg: 'OTP regenerated but email delivery failed. Check console for OTP.',
        otp: process.env.NODE_ENV === 'development' ? otp : undefined
      });
    }

    res.json({ msg: 'OTP resent successfully. Please check your email.' });

  } catch (err) {
    console.error('❌ Resend OTP error:', err);
    res.status(500).json({ error: err.message });
  }
};
// exports.resendOtp = async (req, res) => {
//   const { userId } = req.body;

//   try {
//     const user = await User.findById(userId);
//     if (!user) return res.status(404).json({ msg: 'User not found' });

//     if (user.isEmailVerified) {
//       return res.json({ msg: 'Email already verified' });
//     }

//     const otp = generateOTP();
//     user.otp = otp;
//     user.otpExpiry = Date.now() + 10 * 60 * 1000;
//     await user.save();

//     await sendOTP(user.email, otp);

//     res.json({ msg: 'OTP resent successfully' });

//   } catch (err) {
//     console.error(err.message);
//     res.status(500).send('Server error');
//   }
// };
