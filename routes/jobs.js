const express = require('express');
const {getAllJobs, createJob, getJobById, updateJob, deleteJob} = require('../controllers/jobs');
const router = express.Router();

// /api/v1/jobs
router.route('/').get(getAllJobs).post(createJob);

// /api/v1/jobs/:id
router.route('/:id').get(getJobById).patch(updateJob).delete(deleteJob);

module.exports = router;