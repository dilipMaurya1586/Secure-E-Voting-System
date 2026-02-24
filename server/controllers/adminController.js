const Candidate = require('../models/Candidate');
const Election = require('../models/Election');
const { validationResult } = require('express-validator');

// @route POST /api/admin/elections
exports.createElection = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    const { title, description, startDate, endDate } = req.body;

    try {
        // Convert to Date objects
        const start = new Date(startDate);
        const end = new Date(endDate);
        const now = new Date();

        // ✅ Calculate status based on dates
        let status = 'upcoming';
        if (now >= start && now <= end) {
            status = 'ongoing';
        } else if (now > end) {
            status = 'completed';
        }

        console.log('Date check:', {
            now: now.toISOString(),
            start: start.toISOString(),
            end: end.toISOString(),
            calculatedStatus: status
        });

        const election = new Election({
            title,
            description,
            startDate: start,
            endDate: end,
            status, // ✅ Manually set status
            createdBy: req.user.id
        });

        await election.save();
        res.json(election);
    } catch (err) {
        console.error('Create election error:', err);
        res.status(500).send('Server error');
    }
};
// exports.createElection = async (req, res) => {
//     const errors = validationResult(req);
//     if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

//     const { title, description, startDate, endDate } = req.body;

//     try {
//         const election = new Election({
//             title,
//             description,
//             startDate,
//             endDate,
//             createdBy: req.user.id
//         });

//         await election.save();
//         res.json(election);
//     } catch (err) {
//         console.error(err.message);
//         res.status(500).send('Server error');
//     }
// };

// @route GET /api/admin/elections
exports.getElections = async (req, res) => {
    try {
        const elections = await Election.find().populate('createdBy', 'name email');
        res.json(elections);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};

// @route PUT /api/admin/elections/:id
exports.updateElection = async (req, res) => {
    try {
        let election = await Election.findById(req.params.id);
        if (!election) return res.status(404).json({ msg: 'Election not found' });

        // Only allow updates if election not started?
        const { title, description, startDate, endDate } = req.body;
        election.title = title || election.title;
        election.description = description || election.description;
        election.startDate = startDate || election.startDate;
        election.endDate = endDate || election.endDate;

        await election.save();
        res.json(election);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};

// @route DELETE /api/admin/elections/:id
exports.deleteElection = async (req, res) => {
    try {
        // Pehle check karo ki election exist karta hai
        const election = await Election.findById(req.params.id);

        if (!election) {
            return res.status(404).json({ msg: 'Election not found' });
        }

        // Important: Pehle saare candidates delete karo jo is election se linked hain
        await Candidate.deleteMany({ electionId: req.params.id });

        // Ab election delete karo
        await election.deleteOne();
        // ya
        // await Election.findByIdAndDelete(req.params.id);

        res.json({
            msg: 'Election and all associated candidates removed successfully',
            deletedElection: {
                title: election.title,
                id: election._id
            }
        });
    } catch (err) {
        console.error('Error deleting election:', err.message);

        if (err.kind === 'ObjectId') {
            return res.status(404).json({ msg: 'Invalid election ID format' });
        }

        res.status(500).json({
            msg: 'Server error while deleting election',
            error: err.message
        });
    }
};

// @route GET /api/admin/elections/:id
exports.getElectionById = async (req, res) => {
    try {
        const election = await Election.findById(req.params.id)
            .populate('createdBy', 'name email');

        if (!election) {
            return res.status(404).json({ msg: 'Election not found' });
        }

        res.json(election);
    } catch (err) {
        console.error(err.message);
        if (err.kind === 'ObjectId') {
            return res.status(404).json({ msg: 'Election not found' });
        }
        res.status(500).send('Server error');
    }
};


// @route POST /api/admin/elections/:electionId/candidates
exports.addCandidate = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    const { name, party, symbol, manifesto } = req.body;
    const { electionId } = req.params;

    try {
        // Check if election exists
        const election = await Election.findById(electionId);
        if (!election) return res.status(404).json({ msg: 'Election not found' });

        const candidate = new Candidate({
            name,
            party,
            symbol,
            manifesto,
            electionId
        });

        await candidate.save();
        res.json(candidate);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};

// @route GET /api/admin/elections/:electionId/candidates
exports.getCandidates = async (req, res) => {
    try {
        const candidates = await Candidate.find({ electionId: req.params.electionId });
        res.json(candidates);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};

// @route PUT /api/admin/candidates/:id
// @desc Update candidate details
// @access Admin
exports.updateCandidate = async (req, res) => {
    try {
        const candidate = await Candidate.findById(req.params.id);

        if (!candidate) {
            return res.status(404).json({ msg: 'Candidate not found' });
        }

        const { name, party, symbol, manifesto } = req.body;

        if (name) candidate.name = name;
        if (party) candidate.party = party;
        if (symbol) candidate.symbol = symbol;
        if (manifesto) candidate.manifesto = manifesto;

        await candidate.save();
        res.json(candidate);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};

// @route DELETE /api/admin/candidates/:id
exports.deleteCandidate = async (req, res) => {
    try {
        // Directly find and delete in one go
        const candidate = await Candidate.findByIdAndDelete(req.params.id);

        if (!candidate) {
            return res.status(404).json({ msg: 'Candidate not found' });
        }

        res.json({
            msg: 'Candidate removed successfully',
            deletedCandidate: {
                name: candidate.name,
                party: candidate.party
            }
        });
    } catch (err) {
        console.error('Error deleting candidate:', err.message);

        // Handle invalid ObjectId format
        if (err.kind === 'ObjectId') {
            return res.status(404).json({ msg: 'Invalid candidate ID format' });
        }

        res.status(500).json({
            msg: 'Server error while deleting candidate',
            error: err.message
        });
    }
};

//**************************************************************** */
//  Voter Management (Admin)
// Goal: Admin can view all voters, verify them.

const User = require('../models/User');

// @route GET /api/admin/voters
exports.getVoters = async (req, res) => {
    try {
        const voters = await User.find({ role: 'voter' }).select('-password');
        res.json(voters);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};

// @route PUT /api/admin/voters/:id/verify
exports.verifyVoter = async (req, res) => {
    try {
        const voter = await User.findById(req.params.id);
        if (!voter) return res.status(404).json({ msg: 'Voter not found' });
        if (voter.role !== 'voter') return res.status(400).json({ msg: 'User is not a voter' });

        voter.isVerified = true;
        await voter.save();
        res.json({ msg: 'Voter verified', voter });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};