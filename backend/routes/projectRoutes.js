const express = require('express');
const router = express.Router();
const { createProject, getProjects, getProjectById, deleteProject, updateProject } = require('../controllers/projectController');
const { protect } = require('../middleware/authMiddleware');

router.post('/create', protect, createProject);
router.get('/', getProjects);
router.get('/:id', getProjectById);
router.delete('/:id', protect, deleteProject);
router.put('/:id', protect, updateProject);

module.exports = router;
