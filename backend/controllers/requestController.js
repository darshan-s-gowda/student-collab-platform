const Request = require('../models/Request');
const Project = require('../models/Project');

// POST /api/requests/send
const sendRequest = async (req, res) => {
  try {
    const { project_id, message } = req.body;

    const project = await Project.findById(project_id);
    if (!project) return res.status(404).json({ message: 'Project not found' });

    if (project.owner_id.toString() === req.user._id.toString()) {
      return res.status(400).json({ message: 'You cannot request to join your own project' });
    }

    if (project.members.includes(req.user._id)) {
      return res.status(400).json({ message: 'You are already a member of this project' });
    }

    const existingRequest = await Request.findOne({ project_id, student_id: req.user._id, status: 'pending' });
    if (existingRequest) return res.status(400).json({ message: 'Request already sent' });

    const request = await Request.create({
      project_id,
      student_id: req.user._id,
      message: message || '',
    });

    await request.populate('student_id', 'name email college engineering_branch skills');
    await request.populate('project_id', 'title');
    res.status(201).json(request);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET /api/requests/project/:projectId
const getProjectRequests = async (req, res) => {
  try {
    const project = await Project.findById(req.params.projectId);
    if (!project) return res.status(404).json({ message: 'Project not found' });

    if (project.owner_id.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    const requests = await Request.find({ project_id: req.params.projectId })
      .populate('student_id', 'name email college engineering_branch skills github_profile bio')
      .populate('project_id', 'title')
      .sort({ created_at: -1 });

    res.json(requests);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET /api/requests/my
const getMyRequests = async (req, res) => {
  try {
    const requests = await Request.find({ student_id: req.user._id })
      .populate('project_id', 'title description owner_id')
      .sort({ created_at: -1 });
    res.json(requests);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// PUT /api/requests/accept/:requestId
const acceptRequest = async (req, res) => {
  try {
    const request = await Request.findById(req.params.requestId).populate('project_id');
    if (!request) return res.status(404).json({ message: 'Request not found' });

    const project = request.project_id;
    if (project.owner_id.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    request.status = 'accepted';
    await request.save();

    if (!project.members.includes(request.student_id)) {
      project.members.push(request.student_id);
      await project.save();
    }

    res.json({ message: 'Request accepted', request });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// PUT /api/requests/reject/:requestId
const rejectRequest = async (req, res) => {
  try {
    const request = await Request.findById(req.params.requestId).populate('project_id');
    if (!request) return res.status(404).json({ message: 'Request not found' });

    const project = request.project_id;
    if (project.owner_id.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    request.status = 'rejected';
    await request.save();

    res.json({ message: 'Request rejected', request });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { sendRequest, getProjectRequests, acceptRequest, rejectRequest, getMyRequests };
