const express = require('express');
const router = express.Router();

const questionController = require('../controller/questionController');

router.post('/', function (req, res) {
    questionController.addQuestion(req, res);
});

router.get('/', function (req, res) {
    questionController.getAllMutableQuestions(req, res);
});

router.get('/:id', function (req, res) {
    questionController.getQuestionById(req, res);
});

router.put('/:id', function (req, res) {
    questionController.updateQuestionById(req, res);
});

router.delete('/:id', function (req, res) {
    questionController.removeQuestion(req, res);
});

module.exports = router;