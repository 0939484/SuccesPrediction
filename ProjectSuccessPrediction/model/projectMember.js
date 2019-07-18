'use strict';

const dbModel = require('./db/db');
const db = new dbModel.Database();

const tableModel = require('./table'),
    memberModel = require('./member');

class ProjectMember {
    constructor(projectMember) {
        this.id = projectMember.id;
        this.projectId = projectMember.projectId;
        this.memberId = projectMember.memberId;
    }
}

ProjectMember.constructProjectMemberFromDb = function (dbEntity) {
    return new ProjectMember({
        id: dbEntity.ID,
        projectId: dbEntity.ProjectID,
        memberId: dbEntity.MemberID,
    });
};

ProjectMember.dbEntitiesToProjectMembers = function (dbEntities) {
    let projectMembers = [];
    dbEntities.forEach(dbEntity => {
        projectMembers.push(ProjectMember.constructProjectMemberFromDb(dbEntity));
    });
    return projectMembers;
};

exports.ProjectMember = ProjectMember;

exports.addProjectMember = function (projectMember) {
    return addProjectMemberToDb(projectMember).then(res => {
        projectMember.id = res.insertId;
        return tableModel.increasePeopleNumber(projectMember.projectId);
    }).then(res => {
        return {id: projectMember.id};
    });
};

function addProjectMemberToDb(projectMember) {
    return db.query("INSERT INTO Project_Member (ProjectID, MemberID) VALUES (?,?)",
        [projectMember.projectId, projectMember.memberId]);
}

exports.addProjectMemberIfNotExists = function (projectMember) {
    return getProjectMembersWithProjIdAndMemIdFromDb(projectMember.projectId, projectMember.memberId).then(value => {
        if (value.length !== 0) throw alreadyExistException;
        return exports.addProjectMember(projectMember);
    });
};

function getProjectMembersWithProjIdAndMemIdFromDb(projectId, memberId) {
    return db.query("SELECT * FROM Project_Member WHERE ProjectId = ? AND MemberId = ?",
        [projectId, memberId]);
}

exports.addProjectMemberByEmail = function (projectMember, email) {
    return memberModel.getMemberByEmail(email).then(member => {
        if (member == null) {
            throw noMemberWithEmailException;
        }
        projectMember.memberId = member.id;
        return exports.addProjectMemberIfNotExists(projectMember);
    });
};

exports.getAllProjectMembers = function () {
    return getAllProjectMembersFromDb().then(res => {
        return ProjectMember.dbEntitiesToProjectMembers(res);
    })
};

function getAllProjectMembersFromDb() {
    return db.query("SELECT * FROM Project_Member");
}

exports.getProjectMembersByMemberId = function (memberId) {
    return getProjectMembersByMemberIdFromDb(memberId).then(res => {
        return ProjectMember.dbEntitiesToProjectMembers(res);
    });
};

function getProjectMembersByMemberIdFromDb(memberId) {
    return db.query("SELECT * FROM Project_Member WHERE MemberID = ?", [memberId]);
}

exports.getAllMembersByProjectId = function (projectId) {
    return getProjectMembersByProjectIdFromDb(projectId).then(res => {
        return memberModel.getMembersInIdRange(res.map(value => value['MemberID']));
    });
};

function getProjectMembersByProjectIdFromDb(projectId) {
    return db.query("SELECT * FROM Project_Member WHERE ProjectID = ?", [projectId]);
}

exports.getAllProjectsWithMember = function (memberId) {
    let projectMembers;
    return exports.getProjectMembersByMemberId(memberId).then(pMembers => {
        let idArray = pMembers.map(pMember => pMember.projectId);
        if (idArray.length === 0) throw noProjectsException;
        projectMembers = pMembers;
        return tableModel.getProjectsByIdRange(idArray);
    })
};

exports.getNumOfPeopleAnswered = function (projectId) {
    //TO DO
    const projectAnswerModel = require('./projectAnswer');
    return projectAnswerModel.getMaxNum(projectId).then(setNum => {
        let tempSetNum = setNum[0]['MAX(SetNumber)'];
    })
};

exports.getProjectMemberById = function (id) {
    return getProjectMemberByIdFromDb(id).then(res => {
        if (res.length === 0) return null;
        return ProjectMember.constructProjectMemberFromDb(res[0]);
    });
};

function getProjectMemberByIdFromDb(id) {
    return db.query("SELECT * FROM Project_Member WHERE ID = ?", [id]);
}

exports.getAllMembersFromProject = function (projectId) {
    return exports.getAllMembersByProjectId(projectId).then(pMembers => {

        return pMembers;
    });
};

exports.updateProjectMemberById = function (id, projectMember) {
    return updateProjectMemberByIdInDb(id, projectMember).then(res => {
        return {
            affectedRows: res.affectedRows,
            changedRows: res.changedRows,
        };
    });
};

function updateProjectMemberByIdInDb(id, projectMember) {
    return db.query("UPDATE Project_Member SET ProjectID = ?, MemberID = ?, Root = ? WHERE ID = ?",
        [projectMember.projectId, projectMember.memberId, projectMember.root, id]);
}

exports.removeProjectMember = function (projectId, id) {
    return removeProjectMemberFromDb(projectId, id).then(res => {
        return {affectedRows: res.affectedRows};
    });
};

function removeProjectMemberFromDb(projectId, id) {
    console.log(projectId);
    console.log(id);
    return db.query("DELETE FROM Project_Member WHERE ProjectID = ? AND MemberID = ?", [projectId, id]);
}

const alreadyExistException = {
    name: 'AlreadyExistsException',
    message: 'Member Already connected to the project',
};

const noMemberException = {
    name: 'NoMemberException',
    message: 'There are no members in this project',
};

const noProjectsException = {
    name: 'NoProjectException',
    message: 'There are no projects for member',
};

const noMemberWithEmailException = {
    name: 'NoMemberWithEmailException',
    message: 'There are no members with such email',
};