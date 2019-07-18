const express = require('express');
const router = express.Router();

const answerController = require('../controller/answerController');

router.post('/', function (req, res) {
    answerController.addAnswer(req, res);
});

router.get('/', function (req, res) {
    answerController.getAllAnswers(req, res);
});

router.get('/:id', function (req, res) {
    answerController.getAnswerById(req, res);
});

router.put('/:id', function (req, res) {
    answerController.updateAnswerById(req, res);
});

router.delete('/:id', function (req, res) {
    answerController.removeAnswer(req, res);
});

module.exports = router;