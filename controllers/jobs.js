const {StatusCodes} = require('http-status-codes');
const Job = require('../models/Job');
const {NotFoundError, BadRequestError} = require('../errors');

exports.getAllJobs = async (req, res) => {
    const jobs = await Job.find({createdBy: req.user.userId});

    res.status(StatusCodes.OK).json({
        status: 'success',
        length: jobs.length,
        jobs,
    });
};

exports.getJobById = async (req, res) => {
    const {
        user: {userId},
        params: {id: jobId},
    } = await req;

    const job = await Job.findOne({
        _id: jobId,
        createdBy: userId,
    });

    if (!job) {
        throw new NotFoundError(`No job with id ${jobId}`);
    }

    res.status(StatusCodes.OK).json({
        status: 'success',

        job,
    });
};

exports.createJob = async (req, res) => {
    const {company, position, status} = req.body;

    const createdBy = req.user.userId;

    const job = await Job.create({
        company,
        position,
        status,
        createdBy,
    });

    res.status(StatusCodes.CREATED).json({
        status: 'success',
        job,
    });
};

exports.updateJob = async (req, res) => {
    const {
        body: {company, position},
        user: {userId},
        params: {id: jobId},
    } = await req;

    if (!position || !company) {
        throw new BadRequestError('Company or Position fields cannot be empty!');
    }

    const job = await Job.findByIdAndUpdate(
        {
            _id: jobId,
            createdBy: userId,
        },
        req.body,
        {
            new: true,
            runValidators: true,
        }
    );

    res.status(StatusCodes.OK).json({
        status: 'success',

        job,
    });
};

exports.deleteJob = async (req, res) => {
    const {
        user: {userId},
        params: {id: jobId},
    } = await req;

    const job = await Job.findByIdAndDelete({
        _id: jobId,
        createdBy: userId,
    });

    res.status(StatusCodes.NO_CONTENT).json({
        status: 'success',
    });
};
