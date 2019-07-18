'use strict';

const dbModel = require('./db/db');
const db = new dbModel.Database();

class Answer {
    constructor(answer) {
        this.id = answer.id;
        this.answer = answer.answer;
        this.questionId = answer.questionId
    }
}

Answer.constructAnswerFromDb = function (dbEntity) {
    return new Answer({
        id: dbEntity['ID'],
        answer: dbEntity['Answer'],
        questionId: dbEntity['QuestionID'],
    });
};

Answer.dbEntitiesToAnswers = function (dbEntities) {
    let answers = [];
    dbEntities.forEach(dbEntity => {
        answers.push(Answer.constructAnswerFromDb(dbEntity));
    });
    return answers;
};

exports.Answer = Answer;

exports.addAnswer = function (answer) {
    return addAnswerToDb(answer).then(res => {
        return {id: res.insertId};
    });
};

function addAnswerToDb(answer) {
    return db.query("INSERT INTO Answers (Answer, QuestionID) VALUES (?,?)", [answer.answer, answer.questionId]);
}

exports.getAllAnswers = function () {
    return getAllAnswersFromDb().then(res => {
        return Answer.dbEntitiesToAnswers(res);
    });
};

function getAllAnswersFromDb() {
    return db.query("SELECT * FROM Answers", []);
}

exports.getAnswerById = function (id) {
    return getAnswerByIdFromDb(id).then(res => {
        if (res.length === 0) return null;
        return Answer.constructAnswerFromDb(res[0]);
    })
};

function getAnswerByIdFromDb(id) {
    return db.query("SELECT * FROM Answers WHERE ID=?", [id]);
}

exports.getAnswersIdWithNoAnswer = function () {
    return getAnswersIdWithNoAnswerFromDb().then(answersId => {
        return answersId.map(value => value['ID']);
    });
};

function getAnswersIdWithNoAnswerFromDb() {
    return db.query("SELECT ID FROM Answers WHERE Answer IS NULL", []);
}

exports.getAnswersWithFilledInAnswer = function () {
    return getAnswersWithFilledInAnswerFromDb().then(res => {
        return Answer.dbEntitiesToAnswers(res);
    });
};

function getAnswersWithFilledInAnswerFromDb() {
    return db.query("SELECT ID FROM Answers WHERE Answer NOT NULL", []);
}

exports.getFilledAnswersWithIdAndQuestion = function (idArray, questionId) {
    return getFilledAnswersWithIdAndQuestionFromDb(idArray, questionId).then(answers => {
        return answers.map(answer => answer['Answer']);
    });
};

function getFilledAnswersWithIdAndQuestionFromDb(idArray, questionId) {
    return db.query("SELECT Answer From Answers WHERE ID IN (?) AND QuestionID = ? AND Answer IS NOT NULL", [idArray, questionId]);
}

exports.getAnswersInIdRangeAndEmptyAnswer = function (answerIdArray) {
    return getAnswersInIdRangeAndEmptyAnswerFromDb(answerIdArray).then(res => {
        return Answer.dbEntitiesToAnswers(res);
    });
};

function getAnswersInIdRangeAndEmptyAnswerFromDb(answerIdArray) {
    return db.query("SELECT * FROM Answers WHERE ID IN (?) AND Answer IS NULL", [answerIdArray]);
}

exports.getAverageAnswerWithIdAndQuestion = function (idArray, questionId) {
    return getAverageAnswerWithIdAndQuestionFromDb(idArray, questionId).then(avg => {
        if (avg.length === 0) throw avgException;
        return avg[0]['AVG(Answer)'];
    });
};

function getAverageAnswerWithIdAndQuestionFromDb(idArray, questionId) {
    return db.query("SELECT AVG(Answer) FROM Answers WHERE ID IN (?) AND QuestionID = ?", [idArray, questionId]);
}

exports.countFilledAnswersWithIdAndQuestionsId = function (idArray, questionId) {
    return countFilledAnswersWithIdAndQuestionsIdDb(idArray, questionId).then(count => {
        if (count.length === 0) throw countException;
        return count[0]['COUNT(Answer)'];
    });
};

function countFilledAnswersWithIdAndQuestionsIdDb(idArray, questionId) {
    return db.query("SELECT COUNT(Answer) FROM Answers WHERE ID IN (?) AND Answer IS NOT NULL AND QuestionID = ?", [idArray, questionId]);
}

exports.updateAnswer = function (id, answer) {
    return updateAnswerInDb(id, answer).then(res => {
        return {
            affectedRows: res.affectedRows,
            changedRows: res.changedRows,
        };
    });
};

function updateAnswerInDb(id, answer) {
    return db.query("UPDATE Answers SET Answer = ?, QuestionID = ? WHERE ID = ?", [answer.answer, answer.questionId, id]);
}

exports.removeAnswer = function (id) {
    removeAnswerFromDb(id).then(res => {
        return {affectedRows: res.affectedRows};
    });
};

function removeAnswerFromDb(id) {
    return db.query("DELETE FROM Answers WHERE ID = ?", [id]);
}

const countException = {
    name: 'CountException',
    message: 'Cannot count number',
};

const avgException = {
    name: 'AvgException',
    message: 'Cannot get average number',
};