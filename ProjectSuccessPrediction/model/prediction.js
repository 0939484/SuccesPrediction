'use strict';

const machine_learning = require('../machine_learning/index');
const questionModel = require('./question');
const projectAnswerModel = require('./projectAnswer');
const answerModel = require('./answer');

exports.predict = function (complexity, impact, improvement) {
    return new Promise((resolve, reject) => {
        machine_learning.predict(complexity, impact, improvement, function (result) {
            resolve(result);
        });
    });
};

exports.predictForProject = function (projectId, setNumber) {
    return new Promise(async (resolve, reject) => {
        try {
            const complexity = await exports.getAverageForQuestionFromProject(projectId, setNumber, "Complexity");
            const impact = await exports.getAverageForQuestionFromProject(projectId, setNumber, "Impact");
            const improvement = await exports.getAverageForQuestionFromProject(projectId, setNumber, "Improvement");

            if(complexity == null || impact == null) throw noAnswersException;

            machine_learning.predict(complexity, impact, async function (result) {
                await addOrUpdatePrediction(projectId, setNumber, result);
                resolve(result);
            });
        }
        catch (e) {  
            console.log("Rejection");
            reject(e);
        }
    });
};

function addOrUpdatePrediction(projectId, setNumber, prediction) {
    return questionModel.getQuestionIdByText("Implementation").then(questionId => {
        const projectAnswer = new projectAnswerModel.ProjectAnswer({ projectId: projectId, setNumber: setNumber });
        const answer = new answerModel.Answer({ answer: prediction, questionId: questionId });
        return projectAnswerModel.addOrUpdateProjectPrediction(projectAnswer, answer);
    });
}

exports.recentPredictForProject = function (projectId) {
    return projectAnswerModel.getMaxNum(projectId).then(setNumber => {
        return exports.predictForProject(projectId, setNumber);
    });
};


exports.getAverageForQuestionFromProject = function(projectId, setNumber, questionText) {
    let questionId;
    return questionModel.getQuestionIdByText(questionText)
        .then(questionIdRes => {
            questionId = questionIdRes;
            return projectAnswerModel.getAnswersIdWithProjectIdAndSetNum(projectId, setNumber);
        })
        .then(answersIdArray => {
            if (answersIdArray.length <= 0) {
                throw noAnswersException;
            }
            return answerModel.getAverageAnswerWithIdAndQuestion(answersIdArray, questionId);
        })
}

const noAnswersException = {
    name: 'NoAswersException',
    message: 'There is answers in db',
};