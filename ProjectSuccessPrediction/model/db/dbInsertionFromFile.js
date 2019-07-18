'use strict';

module.exports = function (path) {
    return new Promise(resolve => {
        const readXlsxFile = require('read-excel-file/node');
        const tableModel = require('../../model/table');
        const answerModel = require('../../model/answer');
        const projectAnswerModel = require('../../model/projectAnswer');
        const questionModel = require('../../model/question');

        const schema = {
            'Date': {
                prop: 'startDate',
                type: Date
            },
            'Region': {
                prop: 'location',
                type: String,
            },
            'Country': {
                prop: 'country',
                type: String,
            },
            'TypeCompany': {
                prop: 'sector',
                type: String,
            },
            'NumberPeople': {
                prop: 'peopleNumber',
                type: Number,
            },
            'Impact': {
                prop: 'impact',
                type: Number,
            },
            'Complexity': {
                prop: 'complexity',
                type: Number
            },
            'Improvement': {
                prop: 'improvement',
                type: Number,
            },
            'Implementation': {
                prop: 'implementation',
                type: Number,
            },
        };

        readXlsxFile(path, {schema}).then(({rows, errors}) => {
            if (errors.length !== 0) {
                errors.forEach(function (err) {
                    console.log(err);
                });
                throw errors[0];
            }
            console.log("File read without exceptions");
            insertAllData(rows);
        });

        async function insertAllData(rows) {
            for (let i = 0; i < rows.length; i++) {
                let project = new tableModel.Project(rows[i]);
                await tableModel.addProject(project)
                    .then(projectInsertedRes => {
                        return parseInfoToDb(projectInsertedRes.id, rows[i]);
                    });
            }
            console.log("Insertion finished");
            resolve();
        }

        async function parseInfoToDb(projectId, data) {
            await addQuestionIfNoExistsAndAnswerToIt(projectId, 'Impact', data.impact);
            await addQuestionIfNoExistsAndAnswerToIt(projectId, 'Complexity', data.complexity);
            await addQuestionIfNoExistsAndAnswerToIt(projectId, 'Improvement', data.improvement);
            await addQuestionIfNoExistsAndAnswerToIt(projectId, 'Implementation', data.implementation);
        }

        function addQuestionIfNoExistsAndAnswerToIt(projectId, question, answer) {
            let questionInstance = new questionModel.Question({question: question});
            return questionModel.existsWithQuestion(question).then(res => {
                if (!res.exist)
                    return addQuestionAndAnswerToIt(projectId, questionInstance, answer);
                else {
                    return addAnswerToQuestion(projectId, res.id, answer);
                }
            });
        }

        function addQuestionAndAnswerToIt(projectId, questionInstance, answer) {
            questionModel.addQuestion(questionInstance).then(questionRes => {
                let answerInstance = new answerModel.Answer({answer: answer, questionId: questionRes.id});
                return answerModel.addAnswer(answerInstance);
            }).then(answerRes => {
                let projectAnswerInstance = new projectAnswerModel.ProjectAnswer({
                    projectId: projectId,
                    answersId: answerRes.id
                });
                return projectAnswerModel.addProjectAnswer(projectAnswerInstance);
            });
        }

        function addAnswerToQuestion(projectId, questionId, answer) {
            let answerInstance = new answerModel.Answer({answer: answer, questionId: questionId});
            return answerModel.addAnswer(answerInstance).then(answerRes => {
                let projectAnswerInstance = new projectAnswerModel.ProjectAnswer({
                    projectId: projectId,
                    answersId: answerRes.id,
                });
                return projectAnswerModel.addProjectAnswer(projectAnswerInstance);
            });
        }
    });
};


