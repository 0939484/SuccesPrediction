'use strict';

const dbModel = require('./db/db');
const db = new dbModel.Database();

const projectMemberModel = require('./projectMember');

class Project {
    constructor(project) {
        this.id = project.id;
        this.name = project.name;
        this.startDate = project.startDate;
        this.location = project.location;
        this.country = project.country;
        this.sector = project.sector;
        this.typeProject = project.typeProject;
        this.typeInovation = project.typeInovation;
        this.peopleNumber = project.peopleNumber ? project.peopleNumber : 0;
    }
}

Project.constructProjectFromDb = function (dbEntity) {
    return new Project({
        id: dbEntity.ID,
        name: dbEntity.Name,
        startDate: dbEntity.Startdate,
        location: dbEntity.Location,
        country: dbEntity.Country,
        sector: dbEntity.Sector,
        typeProject: dbEntity.TypeProject,
        typeInovation: dbEntity.TypeInovation,
        peopleNumber: dbEntity.NumberPeople,
    });
};

Project.dbEntitiesProjects = function (dbEntities) {
    let projects = [];
    dbEntities.forEach(dbEntity => {
        projects.push(Project.constructProjectFromDb(dbEntity));
    });
    return projects;
};

exports.Project = Project;

exports.getAllProjects = function () {
    return getAllProjectsFromDb(res => {
        Project.dbEntitiesProjects(res);
    });
};

function getAllProjectsFromDb() {
    return db.query("SELECT * FROM Project", []);
}


exports.getHistoricalProjects = function () {
    return getHistoricalProjectsFromDb(res => {
        Project.dbEntitiesProjects(res);
    });
};

function getHistoricalProjectsFromDb() {
    return db.query("SELECT * FROM Project WHERE Name IS NULL", []);
}

exports.getProjectById = function (id) {
    return getProjectByIdFRomDb(id).then(res => {
        if (res.length === 0) return null;
        return Project.constructProjectFromDb(res[0]);
    });
};

function getProjectByIdFRomDb(id) {
    return db.query("SELECT * FROM Project WHERE ID = ?", [id]);
}

exports.getProjectsByIdRange = function (idArray) {
    return getProjectsWithIdRangeFromDb(idArray).then(res => {
        return Project.dbEntitiesProjects(res);
    });
};

function getProjectsWithIdRangeFromDb(idArray) {
    return db.query("SELECT * FROM Project WHERE ID IN (?)", [idArray]);
}

exports.addProject = function (project) {
    return addProjectToDb(project).then(res => {
        return {id: res.insertId};
    });
};

exports.addProjectAndMember = function (project, memberId) {
    let id;
    return addProjectToDb(project).then(res => {
        id = res.insertId;
        return projectMemberModel.addProjectMember(new projectMemberModel.ProjectMember({
            projectId: res.insertId,
            memberId: memberId,
        }));
    }).then(res => {
        return {id: id};
    });
};

function addProjectToDb(project) {
    return db.query("INSERT INTO Project (Name,Startdate, Location, Country, Sector, TypeProject, TypeInovation, NumberPeople) VALUES (?,?,?,?,?,?,?,?)",
        [project.name, project.startDate, project.location, project.country, project.sector, project.typeProject, project.typeInovation, project.peopleNumber]);
}

exports.updateProjectById = function (id, project) {
    return updateProjectByIdInDb(id, project).then(res => {
        return {
            affectedRows: res.affectedRows,
            changedRows: res.changedRows,
        };
    });
};

function updateProjectByIdInDb(id, project) {
    return db.query("UPDATE Project SET Name = ?, Startdate = ?, Location = ?, Country = ?, Sector = ?, TypeProject = ?, TypeInovation = ?,NumberPeople = ? WHERE ID = ?",
        [project.name, project.startDate, project.location, project.country, project.sector, project.typeProject, project.typeInovation, project.peopleNumber, id])
}

exports.increasePeopleNumber = function (projectId) {
    return increasePeopleNumberInDb(projectId).then(res => {
        return {
            affectedRows: res.affectedRows,
            changedRows: res.changedRows,
        };
    });
};

function increasePeopleNumberInDb(projectId) {
    return db.query("UPDATE Project SET NumberPeople = NumberPeople + 1 WHERE ID = ?", [projectId]);
}

exports.removeProject = function (id) {
    return removeProjectFromDb(id).then(res => {
        return {affectedRows: res.affectedRows};
    });
};

function removeProjectFromDb(id) {
    return db.query("DELETE FROM Project WHERE ID = ?", [id]);
}
