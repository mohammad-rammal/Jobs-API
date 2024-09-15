const express = require('express');
const {getAllJobs, createJob, getJobById, updateJob, deleteJob, getAllJobsFromUser} = require('../controllers/jobs');
const auth = require('../middleware/authentication');
const router = express.Router();

router.use(auth);

// /api/v1/jobs
router.route('/').get(getAllJobs).post(createJob);

// /api/v1/jobs/:id
router.route('/:id').get(getJobById).patch(updateJob).delete(deleteJob);

module.exports = router;
