const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const { adminOnly } = require('../middleware/roleMiddleware');
const {
    declareResult,
    getElectionResults
} = require('../controllers/resultController');

// Admin declare results
router.put('/:electionId/declare', authMiddleware, adminOnly, declareResult);

// Public get results
router.get('/:electionId', getElectionResults);

module.exports = router;