const express = require('express');
const router = express.Router();

const projectAnswerController = require('../controller/projectAnswerController');

router.post('/answer', function (req, res) {
    projectAnswerController.addProjectAnswer(req, res);
});

router.get('/answer', function (req, res) {
    projectAnswerController.getAllProjectAnswers(req, res);
});

router.get('/needAnswer/:memberId', function (req, res) {
    projectAnswerController.getProjectForMemberWithNoAnswer(req, res);
});

router.get('/:projectId/member/:memberId/question/:setNum', function (req, res) {
    projectAnswerController.getProjectQuestionsForMember(req, res);
});

router.get('/:projectId/setNumber/:setNum/statistic', function (req, res) {
    projectAnswerController.getCollectedAnswers(req, res);
});

router.get('/:projectId/statistic', function (req, res) {
    projectAnswerController.getAverageAnswers(req, res);
});

router.get('/:projectId/wholeStatistic', function (req, res) {
    projectAnswerController.getProjectWholeStatistic(req, res);
});

router.get('/:projectId/:setNum/numPeopleAnswered', function (req, res) {
    projectAnswerController.numOfPeopleAnswered(req, res);
});

router.get('/:projectId/numPeopleAnswered', function (req, res) {
    projectAnswerController.numOfPeopleAnsweredFromLastSet(req, res);
});

router.post('/:projectId/sendQuestion', function (req, res) {
    projectAnswerController.sendQuestions(req, res);
});

router.post('/:projectId/sendSelectedQuestion', function (req, res) {
    projectAnswerController.sendSelectedQuestions(req, res);
});

router.get('/answer/:id', function (req, res) {
    projectAnswerController.getProjectAnswerById(req, res);
});

router.put('/answer/:id', function (req, res) {
    projectAnswerController.updateProjectAnswerById(req, res);
});

router.delete('/answer/:id', function (req, res) {
    projectAnswerController.removeProjectAnswer(req, res);
});


module.exports = router;