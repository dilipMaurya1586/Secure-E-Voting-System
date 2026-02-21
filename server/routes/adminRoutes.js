const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const authMiddleware = require('../middleware/authMiddleware');
const { adminOnly } = require('../middleware/roleMiddleware');

const {
    createElection,
    getElections,
    updateElection,
    deleteElection,
    getElectionById,
    addCandidate,
    getCandidates,
    updateCandidate,
    deleteCandidate,
    getVoters,
    verifyVoter,

} = require('../controllers/adminController');

// // Result controller
// const {
//     declareResult,
//     getElectionResults
// } = require('../controllers/resultController');

// All admin routes require auth + admin role
router.use(authMiddleware, adminOnly);

// Election routes
router.post(
    '/elections',
    [
        body('title').notEmpty(),
        body('startDate').isISO8601(),
        body('endDate').isISO8601()
    ],
    createElection
);

router.get('/elections', getElections);
router.get('/elections/:id', getElectionById);
router.put('/elections/:id', updateElection);
router.delete('/elections/:id', deleteElection);

// Candidate routes
router.post('/elections/:electionId/candidates', [
    body('name').notEmpty()
], addCandidate);

router.get('/elections/:electionId/candidates', getCandidates);
router.put('/candidates/:id', updateCandidate);
router.delete('/candidates/:id', deleteCandidate);

// // Result routes
// router.put('/elections/:id/declare', declareResult);
// router.get('/elections/:id/results', getElectionResults); 

// Voter routes
router.get('/voters', getVoters);
router.put('/voters/:id/verify', verifyVoter);

module.exports = router;