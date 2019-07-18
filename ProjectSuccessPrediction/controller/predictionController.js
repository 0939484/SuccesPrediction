'use strict';

const predictionModel = require('../model/prediction');

exports.getPrediction = function (req, res) {

    predictionModel.predict(answers[0], answers[1], answers[2]).then(prediction => {
        res.jsonp(prediction);
    }).catch(err => {
        res.status(500).send(err);
    });
};

exports.getPojectPrediction = function (req, res) {
    console.log("message from controller");
    predictionModel.predictForProject(req.params.projectId, req.params.setNumber).then(prediction => {
        res.jsonp(prediction);
    }).catch(err => {
        res.status(500).send(err);
    });
};

exports.getLastPojectPrediction = function (req, res) {
    predictionModel.recentPredictForProject(req.params.projectId).then(prediction => {
        res.jsonp(prediction);
    }).catch(err => {
        res.status(500).send(err);
    });
};

