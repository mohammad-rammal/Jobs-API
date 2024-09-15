exports.getAllJobs = async (req, res) => {
    res.send('get All Jobs');
};

exports.getJobById = async (req, res) => {
    res.send('get Job');
};

exports.createJob = async (req, res) => {
    res.send(req.user);
};

exports.updateJob = async (req, res) => {
    res.send('update Job');
};

exports.deleteJob = async (req, res) => {
    res.send('delete Job');
};
