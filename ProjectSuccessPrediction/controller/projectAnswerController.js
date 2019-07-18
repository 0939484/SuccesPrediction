'use strict';

const projectAnswerModel = require('../model/projectAnswer');

exports.addProjectAnswer = function (req, res) {
    const projectAnswer = new projectAnswerModel.ProjectAnswer(req.body);
    projectAnswerModel.addProjectAnswer(projectAnswer).then(dbRes => {
        res.jsonp(dbRes);
    }).catch(err => {
        res.status(500).send(err);
    });
};

exports.getAllProjectAnswers = function (req, res) {
    projectAnswerModel.getAllProjectAnswers().then(dbRes => {
        res.jsonp(dbRes);
    }).catch(err => {
        res.status(500).send(err);
    });
};

exports.getProjectForMemberWithNoAnswer = function (req, res) {
    projectAnswerModel.getProjectsForMemberWithNoAnswers(req.params.memberId).then(dbRes => {
        res.jsonp(dbRes);
    }).catch(err => {
        res.status(500).send(err);
    });
};


exports.sendQuestions = function (req, res) {
    projectAnswerModel.sendQuestions(req.params.projectId).then(dbRes => {
        res.jsonp(dbRes);
    }).catch(err => {
        res.status(500).send(err);
    });
};

exports.sendSelectedQuestions = function (req, res) {
    projectAnswerModel.sendSelectedQuestions(req.params.projectId, req.body.questionsId).then(dbRes => {
        res.jsonp(dbRes);
    }).catch(err => {
        res.status(500).send(err);
    });
};

exports.getProjectQuestionsForMember = function (req, res) {
    projectAnswerModel.getProjectQuestionsForMember(req.params.memberId, req.params.projectId, req.params.setNum).then(dbRes => {
        res.jsonp(dbRes);
    }).catch(err => {
        res.status(500).send(err);
    });
};

exports.getCollectedAnswers = function (req, res) {
    projectAnswerModel.getCollectedAnswers(req.params.projectId, req.params.setNum).then(dbRes => {
        res.jsonp(dbRes);
    }).catch(err => {
        res.status(500).send(err);
    });
};

exports.getRecentCollectedAnswers = function (req, res) {
    projectAnswerModel.getRecentCollectedAnswers(req.params.projectId).then(dbRes => {
        res.jsonp(dbRes);
    }).catch(err => {
        res.status(500).send(err);
    });
};

exports.getProjectWholeStatistic = function (req, res) {
    projectAnswerModel.getProjectWholeStatistic(req.params.projectId).then(dbRes => {
        res.jsonp(dbRes);
    }).catch(err => {
        res.status(500).send(err);
    });
};

exports.numOfPeopleAnswered = function (req, res) {
    projectAnswerModel.numOfPeopleAnswered(req.params.projectId, req.params.setNum).then(dbRes => {
        res.jsonp(dbRes);
    }).catch(err => {
        res.status(500).send(err);
    });
};

exports.numOfPeopleAnsweredFromLastSet = function (req, res) {
    projectAnswerModel.numOfPeopleAnsweredFromLastSet(req.params.projectId).then(dbRes => {
        res.jsonp(dbRes);
    }).catch(err => {
        res.status(500).send(err);
    });
};

exports.getProjectAnswerById = function (req, res) {
    projectAnswerModel.getProjectAnswerById(req.params.id).then(dbRes => {
        res.jsonp(dbRes);
    }).catch(err => {
        res.status(500).send(err);
    });
};

exports.updateProjectAnswerById = function (req, res) {
    const projectAnswer = new projectAnswerModel.ProjectAnswer(req.body);
    projectAnswerModel.updateProjectAnswer(req.params.id, projectAnswer).then(dbRes => {
        res.jsonp(dbRes);
    }).catch(err => {
        res.status(500).send(err);
    });
};

exports.removeProjectAnswer = function (req, res) {
    projectAnswerModel.removeProjectAnswer(req.params.id).then(dbRes => {
        res.jsonp(dbRes);
    }).catch(err => {
        res.status(500).send(err);
    });
};

exports.getAverageAnswers = (req, res) =>  {
    projectAnswerModel.getAverageAnswers(req.params.projectId).then(data => {
        res.json(data);
    }, err => {
        res.status(404).send(err);
    })
}