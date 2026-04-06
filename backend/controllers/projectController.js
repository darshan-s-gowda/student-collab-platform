const Project = require('../models/Project');

// POST /api/projects/create
const createProject = async (req, res) => {
  try {
    const { title, description, tech_stack, required_skills, required_members } = req.body;

    const project = await Project.create({
      title,
      description,
      tech_stack: tech_stack || [],
      required_skills: required_skills || [],
      required_members: required_members || 1,
      owner_id: req.user._id,
      members: [req.user._id],
    });

    const populated = await project.populate('owner_id', 'name email college');
    res.status(201).json(populated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET /api/projects
const getProjects = async (req, res) => {
  try {
    const projects = await Project.find({ status: 'open' })
      .populate('owner_id', 'name email college engineering_branch')
      .populate('members', 'name email')
      .sort({ created_at: -1 });
    res.json(projects);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET /api/projects/:id
const getProjectById = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id)
      .populate('owner_id', 'name email college engineering_branch github_profile')
      .populate('members', 'name email college engineering_branch');

    if (!project) return res.status(404).json({ message: 'Project not found' });
    res.json(project);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// DELETE /api/projects/:id
const deleteProject = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) return res.status(404).json({ message: 'Project not found' });

    if (project.owner_id.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    await project.deleteOne();
    res.json({ message: 'Project removed' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// PUT /api/projects/:id
const updateProject = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) return res.status(404).json({ message: 'Project not found' });

    if (project.owner_id.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    const { title, description, tech_stack, required_skills, required_members, status } = req.body;
    project.title = title || project.title;
    project.description = description || project.description;
    project.tech_stack = tech_stack || project.tech_stack;
    project.required_skills = required_skills || project.required_skills;
    project.required_members = required_members || project.required_members;
    project.status = status || project.status;

    const updated = await project.save();
    await updated.populate('owner_id', 'name email college');
    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { createProject, getProjects, getProjectById, deleteProject, updateProject };
