const express = require('express');
const router = express.Router();
const { sendRequest, getProjectRequests, acceptRequest, rejectRequest, getMyRequests } = require('../controllers/requestController');
const { protect } = require('../middleware/authMiddleware');

router.post('/send', protect, sendRequest);
router.get('/my', protect, getMyRequests);
router.get('/project/:projectId', protect, getProjectRequests);
router.put('/accept/:requestId', protect, acceptRequest);
router.put('/reject/:requestId', protect, rejectRequest);

module.exports = router;
