const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const {
  getElections,
  getCandidates,
  castVote,
  getVotingHistory,
  getProfile
} = require('../controllers/voterController');

// All routes require authentication
router.use(authMiddleware);

// Get all elections
router.get('/elections', getElections);

// Get candidates for an election
router.get('/elections/:electionId/candidates', getCandidates);

// Cast vote
router.post('/elections/:electionId/vote', castVote);

// Get voting history
router.get('/history', getVotingHistory);

// Get profile
router.get('/profile', getProfile);

module.exports = router;