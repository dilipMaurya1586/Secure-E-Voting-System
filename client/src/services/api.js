import axios from 'axios';
import { login as apiLogin } from '../services/api';  // ✅ API service import

// In handleSubmit:
const response = await apiLogin({ email, password });
console.log("API file loaded");
console.log("VITE_API_URL:", import.meta.env.VITE_API_URL); // Debug

// ✅ Fix: Don't add extra /api if already present
const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL
});

// Add token to requests
API.interceptors.request.use((req) => {
  const token = localStorage.getItem('token');
  console.log('Token from localStorage:', token);

  if (token) {
    req.headers['x-auth-token'] = token;
    console.log('Headers being sent:', req.headers);
  } else {
    console.warn('No token found!');
  }

  return req;
});


// Auth APIs
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

export default API;