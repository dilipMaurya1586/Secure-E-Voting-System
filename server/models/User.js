const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  customUserId: { type: String, unique: true, required: true },
  firstName: { type: String, required: true },
  middleName: { type: String, required: true },
  lastName: { type: String, required: true },
  mobileNumber: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['voter', 'admin'], default: 'voter' },
  voterId: { type: String, unique: true, sparse: true },
  isVerified: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
  address: {
    street: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
    pincode: { type: String, required: true },
    country: { type: String, default: 'India' }
  },
  // New fields
  dateOfBirth: { type: Date, required: true },
  aadharNumber: { type: String, required: true, unique: true },
  aadharImage: { type: String }, // path to uploaded file
  isEmailVerified: { type: Boolean, default: false },
  isDocumentVerified: { type: Boolean, default: false },
  otp: { type: String },
  otpExpiry: { type: Date },
});
module.exports = mongoose.model('User', UserSchema);