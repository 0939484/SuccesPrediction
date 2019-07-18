'use strict';

const dbModel = require('./db/db');
const db = new dbModel.Database();
const {nonMutableQuestions} = require('../configure');

class Question {
    constructor(question) {
        this.id = question.id;
        this.question = question.question;
    }
}

Question.constructQuestionFromDb = function (dbEntity) {
    return new Question({
        id: dbEntity.ID,
        question: dbEntity.Question
    });
};

Question.dbEntitiesToQuestions = function (dbEntities) {
    let questions = [];
    dbEntities.forEach(dbEntity => {
        questions.push(Question.constructQuestionFromDb(dbEntity));
    });
    return questions;
};

exports.Question = Question;

exports.addQuestion = function (question) {
    return addQuestionToDb(question).then(res => {
        return {id: res.insertId,}
    });
};

function addQuestionToDb(question) {
    return db.query("INSERT INTO Question (Question) VALUES (?)", [question.question]);
}

exports.existsWithQuestion = function (question) {
    return getQuestionWithTextFromDb(question).then(res => {
        return {
            exist: res.length > 0,
            id: res.length > 0 ? res[0].ID : null,
        }
    });
};

exports.getQuestionIdByText = function (question) {
    return getQuestionWithTextFromDb(question).then(dbRes => {
        if (dbRes.length === 0) return null;
        return dbRes[0].ID;
    });
};

function getQuestionWithTextFromDb(text) {
    return db.query("SELECT * FROM Question WHERE Question = ?", [text]);
}

exports.getAllMutableQuestions = async function () {
    return getAllMutableQuestionsFromDb().then(res => {
        return Question.dbEntitiesToQuestions(res);
    });
};

function getAllMutableQuestionsFromDb() {
    return db.query("SELECT * FROM Question WHERE NOT Question = ?", [nonMutableQuestions]);
}

exports.getAllQuestions = function () {
    return getAllQuestionsFromDb().then(res => {
        return Question.dbEntitiesToQuestions(res);
    });
};

function getAllQuestionsFromDb() {
    return db.query("SELECT * FROM Question");
}

exports.getQuestionById = function (id) {
    return getQuestionByIdFromDb(id).then(res => {
        if (res.length === 0) return null;
        return Question.constructQuestionFromDb(res[0]);
    });
};

function getQuestionByIdFromDb(id) {
    return db.query("SELECT * FROM Question WHERE ID = ?", id);
}


exports.getQuestionsInIdRange = function (idArray) {
    return getQuestionsInIdRange(idArray).then(res => {
        return Question.dbEntitiesToQuestions(res);
    });
};

function getQuestionsInIdRange(idArray) {
    return db.query("SELECT * FROM Question WHERE ID IN (?)", [idArray])
}

exports.updateQuestion = function (id, question) {
    return updateQuestionInDb(id, question).then(res => {
        return {
            affectedRows: res.affectedRows,
            changedRows: res.changedRows,
        };
    });
};

function updateQuestionInDb(id, question) {
    return db.query("UPDATE Question SET Question = ? WHERE ID = ?", [question.question, id]);
}

exports.removeQuestion = function (id) {
    return removeQuestionFromDb(id).then(res => {
        return {affectedRows: res.affectedRows};
    });
};

function removeQuestionFromDb(id) {
    return db.query("DELETE FROM Question WHERE ID = ?", id);
}
