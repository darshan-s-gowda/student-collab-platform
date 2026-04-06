const User = require('../models/User');
const Project = require('../models/Project');

// GET /api/users/profile
const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password');
    if (!user) return res.status(404).json({ message: 'User not found' });

    const projectsCreated = await Project.find({ owner_id: user._id }).populate('owner_id', 'name email');
    const projectsJoined = await Project.find({ members: user._id, owner_id: { $ne: user._id } }).populate('owner_id', 'name email');

    res.json({ ...user.toObject(), projectsCreated, projectsJoined });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET /api/users/:id
const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    if (!user) return res.status(404).json({ message: 'User not found' });

    const projectsCreated = await Project.find({ owner_id: user._id }).populate('owner_id', 'name email');
    const projectsJoined = await Project.find({ members: user._id, owner_id: { $ne: user._id } }).populate('owner_id', 'name email');

    res.json({ ...user.toObject(), projectsCreated, projectsJoined });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// PUT /api/users/profile
const updateUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    const { name, email, password, gender, college, engineering_branch, github_profile, skills, bio } = req.body;

    user.name = name || user.name;
    user.email = email || user.email;
    user.gender = gender || user.gender;
    user.college = college || user.college;
    user.engineering_branch = engineering_branch || user.engineering_branch;
    user.github_profile = github_profile !== undefined ? github_profile : user.github_profile;
    user.skills = skills || user.skills;
    user.bio = bio !== undefined ? bio : user.bio;
    if (password) user.password = password;

    const updatedUser = await user.save();

    res.json({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      college: updatedUser.college,
      engineering_branch: updatedUser.engineering_branch,
      github_profile: updatedUser.github_profile,
      skills: updatedUser.skills,
      bio: updatedUser.bio,
      gender: updatedUser.gender,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getUserProfile, updateUserProfile, getUserById };
