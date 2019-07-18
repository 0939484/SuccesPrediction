'use strict';

const questionModel = require('../model/question');

exports.addQuestion = function (req, res) {
    const question = new questionModel.Question(req.body);
    questionModel.addQuestion(question).then(dbRes => {
        res.jsonp(dbRes);
    }).catch(err => {
        res.status(500).send(err);
    });
};

exports.getAllMutableQuestions = function (req, res) {
    questionModel.getAllMutableQuestions().then(dbRes => {
        res.jsonp(dbRes);
    }).catch(err => {
        res.status(500).send(err);
    });
};

exports.getQuestionById = function (req, res) {
    questionModel.getQuestionById(req.params.id).then(dbRes => {
        res.jsonp(dbRes);
    }).catch(err => {
        res.status(500).send(err);
    });
};

exports.updateQuestionById = function (req, res) {
    const question = new questionModel.Question(req.body);
    questionModel.updateQuestion(req.params.id, question).then(dbRes => {
        res.jsonp(dbRes);
    }).catch(err => {
        res.status(500).send(err);
    });
};

exports.removeQuestion = function (req, res) {
    questionModel.removeQuestion(req.params.id).then(dbRes => {
        res.jsonp(dbRes);
    }).catch(err => {
        res.status(500).send(err);
    });
};