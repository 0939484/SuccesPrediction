'use strict';

const dbModel = require('./db/db');
const predictionModel = require("./prediction");
const db = new dbModel.Database();

const tableModel = require('./table'),
    answerModel = require('./answer'),
    questionModel = require('./question'),
    projectMemberModel = require('./projectMember');

const mailer = require('../tools/mailer');

class ProjectAnswer {
    constructor(projectAnswer) {
        this.id = projectAnswer.id;
        this.projectId = projectAnswer.projectId;
        this.answersId = projectAnswer.answersId;
        this.memberId = projectAnswer.memberId;
        this.setNumber = projectAnswer.setNumber;
    }
}

ProjectAnswer.constructProjectAnswerFromDb = function (dbEntity) {
    return new ProjectAnswer({
        id: dbEntity.ID,
        projectId: dbEntity.ProjectID,
        answersId: dbEntity.AnswersID,
        memberId: dbEntity.MemberID,
        setNumber: dbEntity.SetNumber,
    });
};

ProjectAnswer.dbEntitiesToProjectAnswers = function (dbEntities) {
    let projectAnswers = [];
    dbEntities.forEach(dbEntity => {
        projectAnswers.push(ProjectAnswer.constructProjectAnswerFromDb(dbEntity));
    });
    return projectAnswers;
};

exports.ProjectAnswer = ProjectAnswer;

exports.addProjectAnswer = function (projectAnswer) {
    return addProjectAnswerToDb(projectAnswer).then(res => {
        return {id: res.insertId};
    });
};

function addProjectAnswerToDb(projectAnswer) {
    return db.query("INSERT INTO Project_Answers (ProjectID, AnswersID, MemberID, SetNumber) VALUES (?,?,?,?)",
        [projectAnswer.projectId, projectAnswer.answersId, projectAnswer.memberId, projectAnswer.setNumber]);
}

exports.addOrUpdateProjectPrediction = function (projectAnswer, answer) {
    return predictionExists(projectAnswer.projectId, projectAnswer.setNumber).then(exist => {
        if (exist) return {affectedRows: 0};
        return exports.addProjectPrediction(projectAnswer, answer);
    });
};

exports.addProjectPrediction = function (projectAnswer, answer) {
    return answerModel.addAnswer(answer).then(res => {
        projectAnswer.answersId = res.id;
        return exports.addProjectAnswer(projectAnswer);
    });
};

function predictionExists(projectId, setNum) {
    return getPredictionAnswersIdFromDb(projectId, setNum).then(idArray => {
        if (idArray.length === 0) return false;
        return true;
    });
}

function getPredictionAnswersIdFromDb(projectId, setNum) {
    return db.query("SELECT AnswersID FROM Project_Answers WHERE ProjectID = ? AND SetNumber = ? AND MemberID IS NULL",
        [projectId, setNum]);
}

exports.getAllProjectAnswers = function () {
    return getAllProjectAnswersFromDb().then(projectAnswers => {
        return ProjectAnswer.dbEntitiesToProjectAnswers(projectAnswers);
    });
};

function getAllProjectAnswersFromDb() {
    return db.query("SELECT * FROM Project_Answers", []);
}

exports.getProjectsForMemberWithNoAnswers = function (memberId) {
    return getProjectIdAndSetNumWithNoAnswers(memberId).then(projectIdAndSetNumArray => {
        if (projectIdAndSetNumArray.length === 0) throw noProjectToAnswerException;
        return getProjectsWithSetNum(projectIdAndSetNumArray);
    });
};

function getProjectIdAndSetNumWithNoAnswers(memberId) {
    return answerModel.getAnswersIdWithNoAnswer().then(answersId => {
        if (answersId.length === 0) throw noQuestionForMember;
        return exports.getProjectIdAndSetNumWithMemberIdAndAnswerIdRange(memberId, answersId);
    });
}

exports.getProjectIdAndSetNumWithMemberIdAndAnswerIdRange = function (memberId, answerIdArray) {
    return getProjectIdAndSetNumWithMemberIdAndAnswerIdRangeFromDb(memberId, answerIdArray).then(projectsId => {
        return projectsId.map(value => {
            return {projectId: value['ProjectID'], setNumber: value['SetNumber']}
        });
    })
};

function getProjectIdAndSetNumWithMemberIdAndAnswerIdRangeFromDb(memberId, answerIdArray) {
    return db.query("SELECT DISTINCT ProjectID, SetNumber FROM Project_Answers WHERE MemberID = ? AND AnswersID IN (?)", [memberId, answerIdArray]);
}

async function getProjectsWithSetNum(projectIdAndSetNumArray) {
    let projects = [];
    for (let i = 0; i < projectIdAndSetNumArray.length; i++) {
        projects[i] = await getProjectAndAddSetNum(projectIdAndSetNumArray[i].projectId, projectIdAndSetNumArray[i].setNumber);
    }
    return projects;
}

function getProjectAndAddSetNum(projectId, setNum) {
    return tableModel.getProjectById(projectId).then(project => {
        if (!project) return null;
        project.setNumber = setNum;
        return project;
    });
}

exports.getAnswersIdWithProjectIdAndSetNum = function (projectId, setNum) {
    return getAnswersIdWithProjectIdAndSetNumFromDb(projectId, setNum).then(dbRes => {
        return dbRes.map(value => value['AnswersID']);
    });
};

function getAnswersIdWithProjectIdAndSetNumFromDb(projectId, setNum) {
    
    if(setNum == undefined) {
        return db.query("SELECT AnswersID FROM Project_Answers WHERE ProjectID = ?", [projectId]);
    }
    return db.query("SELECT AnswersID FROM Project_Answers WHERE ProjectID = ? AND SetNumber = ?", [projectId, setNum]);
}


exports.getAnswerIds = function (projectId) {
    return getAnswersIdsFromDb(projectId).then(dbRes => {
        return dbRes.map(value => value['AnswersID']);
    });
};

function getAnswersIdsFromDb(projectId) {
    return db.query("SELECT AnswersID FROM Project_Answers WHERE ProjectID = ?", [projectId]);
}

exports.sendQuestions = function (projectId) {
    return questionModel.getAllMutableQuestions().then(questions => {
        if (questions.length === 0) throw noQuestionInDatabase;
        return exports.sendSelectedQuestions(projectId, questions.map(question => question.id))
    });
};

exports.sendSelectedQuestions = function (projectId, questionsId) {
    let tempSetNum;
    return exports.getMaxNum(projectId).then(setNum => {
        tempSetNum = setNum == null ? 1 : setNum + 1;
        return questionModel.getQuestionsInIdRange(questionsId);
    }).then(questions => {
        if (questions.length === 0) throw noQuestionInDatabase;
        getMembersAndAddEmptyAnswersToProjectMembers(questions, projectId, tempSetNum);
        return {success: true};
    });
};

async function getMembersAndAddEmptyAnswersToProjectMembers(questions, projectId, setNum) {
    return getMembersToSendQuestions(projectId).then(members => {
        sendNotificationsToMail(members);
        addEmptyAnswersToProjectMembers(questions, projectId, members, setNum);
    })
}

function getMembersToSendQuestions(projectId) {
    return projectMemberModel.getAllMembersByProjectId(projectId);
}

async function sendNotificationsToMail(members) {
    const messageText = "Please answer question on project";
    await mailer.sendMessageToMails(members.map(member => member.emailAddress), messageText);
}

async function addEmptyAnswersToProjectMembers(questions, projectId, members, setNum) {
    for (let i = 0; i < members.length; i++) {
        await addEmptyAnswerToProjectMember(questions, projectId, members[i].id, setNum);
    }
}

async function addEmptyAnswerToProjectMember(questions, projectId, memberId, setNum) {
    for (let i = 0; i < questions.length; i++) {
        const answer = new answerModel.Answer({answer: null, questionId: questions[i].id});
        await addEmptyAnswer(answer, projectId, memberId, setNum);
    }
}

function addEmptyAnswer(answerInstance, projectId, memberId, setNum) {
    return answerModel.addAnswer(answerInstance).then(dbRes => {
        return exports.addProjectAnswer(new ProjectAnswer({
            projectId: projectId,
            answersId: dbRes.id,
            memberId: memberId,
            setNumber: setNum,
        }))
    });
}

exports.getMaxNum = function (projectId) {
    return getMaxNumFromDb(projectId).then(res => {
        if (res.length === 0) return null;
        return res[0]['MAX(SetNumber)'];
    });
};

function getMaxNumFromDb(projectId) {
    return db.query("SELECT MAX(SetNumber) FROM Project_Answers WHERE ProjectID = ?", [projectId]);
}

exports.getProjectQuestionsForMember = function (memberId, projectId, setNumber) {
    let selectedAnswers = [];
    return getAnswersIdByCritearias(memberId, projectId, setNumber).then(answerIdArray => {
        if (answerIdArray.length === 0) throw noQuestionForMember;
        return answerModel.getAnswersInIdRangeAndEmptyAnswer(answerIdArray);
    }).then(importantAnswers => {
        let questionIdArray = importantAnswers.map(value => value.questionId);
        if (questionIdArray.length === 0) throw noQuestionInDatabase;
        selectedAnswers = importantAnswers;
        return questionModel.getQuestionsInIdRange(questionIdArray);
    }).then(questions => {
        return connectAnswersIdToQuestions(questions, selectedAnswers);
    });
};


function getAnswersIdByCritearias(memberId, projectId, setNumber) {
    return getAnswersIdByCriteariasFromDb(memberId, projectId, setNumber).then(res => {
        return res.map(value => value['AnswersID']);
    });
}

function getAnswersIdByCriteariasFromDb(memberId, projectId, setNumber) {
    return db.query("SELECT AnswersID FROM Project_Answers WHERE MemberID = ? AND ProjectID = ? AND SetNumber = ?",
        [memberId, projectId, setNumber]);
}

function connectAnswersIdToQuestions(questions, answers) {
    for (let i = 0; i < questions.length; i++) {
        questions[i].answersId = answers[i]['id'];
    }
    return questions;
}

exports.getCollectedAnswers = function (projectId, setNum) {
    return questionModel.getAllMutableQuestions().then(async questions => {
        let result = {};
        for (let i = 0; i < questions.length; i++) {
            result[`${questions[i].question}`] = await getCollectedAnswersToQuestionId(projectId, setNum, questions[i].id);
        }
        return result;
    });
};

function getCollectedAnswersToQuestionId(projectId, setNum, questionId) {
    return exports.getAnswersIdWithProjectIdAndSetNum(projectId, setNum).then(answersId => {
        return answerModel.getFilledAnswersWithIdAndQuestion(answersId, questionId);
    });
}

exports.getRecentCollectedAnswers = function (projectId) {
    return exports.getMaxNum(projectId).then(setNum => {
        return exports.getCollectedAnswers(projectId, setNum);
    });
};

exports.getProjectWholeStatistic = function (projectId) {
    let response = {projectId: projectId, statistic: []};
    console.log("test");
    return getAllProjectAnswersPredictionsFromDb(projectId).then(async res => {
        console.log("response from db: " + JSON.stringify(res));
        for (let i = 0; i < res.length; i++) {
            const prediction = await getOneSetNumStatistic(res[i]['SetNumber'], res[i]['AnswersID']);
            console.log(prediction);
            response.statistic.push(prediction);
        }
        return response;
    });
};

function getAllProjectAnswersPredictionsFromDb(projectId) {
    return db.query("SELECT * FROM Project_Answers WHERE ProjectID = ? AND MemberID IS NULL",
        [projectId]);
}

function getOneSetNumStatistic(setNum, predictionId) {
    return answerModel.getAnswerById(predictionId).then(answer => {
        return {
            setNumber: setNum,
            prediction: answer.answer,
        };
    });
}

exports.numOfPeopleAnswered = function (projectId, setNumber) {
    let mustAnsweredQuestionId;
    return questionModel.getQuestionIdByText("Complexity").then(id => {
        if (id === null) throw noMustAnsweredQuestion;
        mustAnsweredQuestionId = id;
        return exports.getAnswersIdWithProjectIdAndSetNum(projectId, setNumber);
    }).then(idArray => {
        return answerModel.countFilledAnswersWithIdAndQuestionsId(idArray, mustAnsweredQuestionId);
    });
};

exports.numOfPeopleAnsweredFromLastSet = function (projectId) {
    return exports.getMaxNum(projectId).then(setNum => {
        return exports.numOfPeopleAnswered(projectId, setNum);
    });
};

exports.getProjectAnswerById = function (id) {
    return getProjectAnswerByIdFromDb(id).then(res => {
        if (res.length === 0) return null;
        return ProjectAnswer.dbEntitiesToProjectAnswers(res);
    });
};

function getProjectAnswerByIdFromDb(id) {
    return db.query("SELECT * FROM Project_Answers WHERE ID=?", id);
}

exports.updateProjectAnswer = function (id, projectAnswer) {
    return updateProjectAnswerInDb(id, projectAnswer).then(res => {
        return {
            affectedRows: res.affectedRows,
            changedRows: res.changedRows,
        };
    });
};

function updateProjectAnswerInDb(id, projectAnswer) {
    return db.query("UPDATE Project_Answers SET ProjectID = ?, AnswersID = ? WHERE ID = ?",
        [projectAnswer.projectId, projectAnswer.answersId, projectAnswer.memberId, projectAnswer.setNumber, id]);
}

exports.removeProjectAnswer = function (id) {
    return removeProjectAnswerFromDb(id).then(res => {
        return {affectedRows: res.affectedRows};
    });
};

exports.getAverageAnswers = (projectId) => {
    return new Promise((resolve, reject) => {
        this.getMaxNum(projectId).then(async setNumber => {
            try {
                const complexity = await predictionModel.getAverageForQuestionFromProject(projectId, setNumber, "Complexity");
                const impact = await predictionModel.getAverageForQuestionFromProject(projectId, setNumber, "Impact");
    
                if(complexity == null || impact == null) throw noAnswersException;
    
                resolve({complexity: complexity, impact: impact});
            }
            catch (e) {  
                console.log("error " + JSON.stringify(e));
                reject({"name":"NoAswersException","message":"There is answers in db"});
            }
        })
    });
}

exports.getAverageForQuestionFromProject = function(projectId, questionText) {
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

function removeProjectAnswerFromDb(id) {
    return db.query("DELETE FROM Project_Answers WHERE ID = ?", [id]);
}

const noQuestionForMember = {
    name: 'NoQuestionException',
    message: 'There is no Questions for member',
};

const noQuestionInDatabase = {
    name: 'NoQuestionException',
    message: 'There are no Questions in db',
};

const noProjectToAnswerException = {
    name: 'NoProjectToAnswerException',
    message: 'There are no Projects that need attedntion',
};

const noMustAnsweredQuestion = {
    name: 'NoMustAnsweredQuestion',
    message: 'There is no question that must be answered in db',
};