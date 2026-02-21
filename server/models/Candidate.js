const mongoose = require('mongoose');

const CandidateSchema = new mongoose.Schema({
  name: { type: String, required: true },
  party: String,
  symbol: String, // image URL
  manifesto: String,
  electionId: { type: mongoose.Schema.Types.ObjectId, ref: 'Election', required: true },
  voteCount: { type: Number, default: 0 } // optional, can be derived from votes
});

module.exports = mongoose.model('Candidate', CandidateSchema);