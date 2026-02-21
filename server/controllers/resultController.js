const Election = require('../models/Election');
const Candidate = require('../models/Candidate');
const Vote = require('../models/Vote');

// @route GET /api/results/:electionId (admin or public after declaration)
exports.getElectionResults = async (req, res) => {
  try {
    const election = await Election.findById(req.params.electionId);
    if (!election) return res.status(404).json({ msg: 'Election not found' });

    // If election not completed, restrict access (admin can see, voters cannot)
    // For simplicity, we'll allow only if completed, or admin
    if (election.status !== 'completed' && req.user.role !== 'admin') {
      return res.status(403).json({ msg: 'Results not yet declared' });
    }

    const candidates = await Candidate.find({ electionId: election._id }).select('name party voteCount');
    const totalVotes = candidates.reduce((acc, c) => acc + c.voteCount, 0);

    res.json({ election, candidates, totalVotes });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

// @route PUT /api/results/:electionId/declare
exports.declareResult = async (req, res) => {
    try {
        const election = await Election.findById(req.params.electionId);
        
        if (!election) {
            return res.status(404).json({ msg: 'Election not found' });
        }

        // ✅ Status update karo
        election.status = 'completed';
        await election.save();

        res.json({ 
            msg: 'Election completed and results published',
            election: {
                _id: election._id,
                title: election.title,
                status: election.status,  // Ab "completed" aayega
                startDate: election.startDate,
                endDate: election.endDate
            }
        });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};