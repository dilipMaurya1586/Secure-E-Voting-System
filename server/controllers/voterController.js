// backend/controllers/voterController.js

const Election = require('../models/Election');
const Candidate = require('../models/Candidate');
const Vote = require('../models/Vote');
const User = require('../models/User');

// @route GET /api/voter/elections
// @desc Get all elections for voter
exports.getElections = async (req, res) => {
  try {
    const elections = await Election.find().sort({ startDate: 1 });
    res.json(elections);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

// @route GET /api/voter/elections/:electionId/candidates
// @desc Get candidates for a specific election
exports.getCandidates = async (req, res) => {
  try {
    const candidates = await Candidate.find({ electionId: req.params.electionId });
    res.json(candidates);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

// @route POST /api/voter/elections/:electionId/vote
// @desc Cast a vote
exports.castVote = async (req, res) => {
  const { candidateId } = req.body;
  const { electionId } = req.params;

  try {
    // Check if election exists and is ongoing
    const election = await Election.findById(electionId);
    if (!election) {
      return res.status(404).json({ msg: 'Election not found' });
    }

    const now = new Date();
    if (now < election.startDate || now > election.endDate) {
      return res.status(400).json({ msg: 'Voting is not allowed at this time' });
    }

    // Check if voter already voted
    const existingVote = await Vote.findOne({ 
      voterId: req.user.id, 
      electionId 
    });
    
    if (existingVote) {
      return res.status(400).json({ msg: 'Already voted in this election' });
    }

    // Check if candidate exists in this election
    const candidate = await Candidate.findOne({ 
      _id: candidateId, 
      electionId 
    });
    
    if (!candidate) {
      return res.status(400).json({ msg: 'Invalid candidate' });
    }

    // Cast vote
    const vote = new Vote({
      voterId: req.user.id,
      electionId,
      candidateId
    });
    
    await vote.save();

    // Increment vote count in candidate
    candidate.voteCount += 1;
    await candidate.save();

    res.json({ 
      msg: 'Vote cast successfully',
      vote 
    });
  } catch (err) {
    console.error(err.message);
    
    // Handle duplicate vote error (unique index)
    if (err.code === 11000) {
      return res.status(400).json({ msg: 'Already voted in this election' });
    }
    
    res.status(500).send('Server error');
  }
};

// @route GET /api/voter/history
// @desc Get voter's voting history
exports.getVotingHistory = async (req, res) => {
  try {
    const votes = await Vote.find({ voterId: req.user.id })
      .populate('electionId', 'title startDate endDate')
      .populate('candidateId', 'name party');
    
    res.json(votes);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

// @route GET /api/voter/profile
// @desc Get voter's own profile
exports.getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    res.json(user);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};