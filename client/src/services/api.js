import axios from 'axios';

console.log("API file loaded");
console.log("API URL from env:", import.meta.env.VITE_API_URL);

// ✅ Create axios instance first
const API = axios.create({
  // baseURL:  'http://localhost:5000/api'
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api'
});

// ✅ Add token interceptor
API.interceptors.request.use((req) => {
  const token = localStorage.getItem('token');
  if (token) {
    req.headers['x-auth-token'] = token;
  }
  return req;
});

// OTP verification
export const verifyOtp = (data) => API.post('/auth/verify-otp', data);
export const resendOtp = (data) => API.post('/auth/resend-otp', data);

// For file uploads (no need to set Content-Type, browser will set it)
export const registerWithFile = (formData) => API.post('/auth/register', formData, {
  headers: { 'Content-Type': 'multipart/form-data' }
});

// ✅ Define functions AFTER API instance
export const register = (userData) => API.post('/auth/register', userData);
export const login = (userData) => API.post('/auth/login', userData);
export const fetchUser = () => API.get('/auth/me');

// Voter APIs
export const getElections = () => API.get('/voter/elections');
export const getCandidates = (electionId) =>
  API.get(`/voter/elections/${electionId}/candidates`);
export const castVote = (electionId, candidateId) =>
  API.post(`/voter/elections/${electionId}/vote`, { candidateId });
export const getVotingHistory = () => API.get('/voter/history');

// Admin APIs - Election Management
export const createElection = (data) => API.post('/admin/elections', data);
export const getAdminElections = () => API.get('/admin/elections');
export const getElectionById = (id) => API.get(`/admin/elections/${id}`);
export const updateElection = (id, data) => API.put(`/admin/elections/${id}`, data);
export const deleteElection = (id) => API.delete(`/admin/elections/${id}`);

// Admin APIs - Candidate Management
export const addCandidate = (electionId, data) =>
  API.post(`/admin/elections/${electionId}/candidates`, data);
export const getAdminCandidates = (electionId) =>
  API.get(`/admin/elections/${electionId}/candidates`);
export const updateCandidate = (id, data) => API.put(`/admin/candidates/${id}`, data);
export const deleteCandidate = (id) => API.delete(`/admin/candidates/${id}`);

// Admin APIs - Voter Management
export const getVoters = () => API.get('/admin/voters');
export const verifyVoter = (id) => API.put(`/admin/voters/${id}/verify`);

// Results APIs
export const getResults = (electionId) => API.get(`/results/${electionId}`);
export const declareResult = (electionId) => API.put(`/results/${electionId}/declare`);

// ✅ Default export
export default API;
