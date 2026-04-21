const express = require('express');
const router = express.Router();
const { askQuestion, getQuestions, answerQuestion, deleteQuestion, deleteAnswer } = require('../controllers/qaController');
const { protect } = require('../middleware/auth');

router.get('/', getQuestions);
router.post('/', protect, askQuestion);
router.delete('/:id', protect, deleteQuestion);
router.post('/:id/answers', protect, answerQuestion);
router.delete('/answers/:answerId', protect, deleteAnswer);

module.exports = router;
