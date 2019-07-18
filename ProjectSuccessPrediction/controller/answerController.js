'use strict';

const answerModel = require('../model/answer');

exports.addAnswer = function (req, res) {
    const answer = new answerModel.Answer(req.body);
    answerModel.addAnswer(answer).then(dbRes => {
        res.jsonp(dbRes);
    }).catch(err => {
        res.status(500).send(err);
    });
};

exports.getAllAnswers = function (req, res) {
    answerModel.getAllAnswers().then(dbRes => {
        res.jsonp(dbRes);
    }).catch(err => {
        res.status(500).send(err);
    });
};

exports.getAnswerById = function (req, res) {
    answerModel.getAnswerById(req.params.id).then(dbRes => {
        res.jsonp(dbRes);
    }).catch(err => {
        res.status(500).send(err);
    });
};

exports.updateAnswerById = function (req, res) {
    const answer = new answerModel.Answer(req.body);
    answerModel.updateAnswer(req.params.id, answer).then(dbRes => {
        res.jsonp(dbRes);
    }).catch(err => {
        res.status(500).send(err);
    });
};

exports.removeAnswer = function (req, res) {
    answerModel.removeAnswer(req.params.id).then(dbRes => {
        res.jsonp(dbRes);
    }).catch(err => {
        res.status(500).send(err);
    });
};