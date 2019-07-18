'use strict';

const tableModel = require('../model/table');

exports.getTable = function (req, res) {
    tableModel.getAllProjects().then(dbRes => {
        res.jsonp(dbRes);
    }).catch(err => {
        res.status(500).send(err);
    });
};

exports.getHistoricalProjects = function (req, res) {
    tableModel.getHistoricalProjects().then(dbRes => {
        res.jsonp(dbRes);
    }).catch(err => {
        res.status(500).send(err);
    });
};

exports.getProjectsOfMember = function (req, res) {
    const projectMemberModel = require('../model/projectMember');
    projectMemberModel.getProjectMembersByMemberId(req.params.memberId).then(projectMembers => {
        return tableModel.getProjectsByIdRange(projectMembers.map(val => val.ProjectID));
    }).then(dbRes => {
        res.jsonp(dbRes);
    }).catch(err => {
        res.status(500).send(err);
    });
};

exports.addProject = function (req, res) {
    let project = new tableModel.Project(req.body);
    tableModel.addProjectAndMember(project, req.body.memberId).then(dbRes => {
        res.jsonp(dbRes);
    }).catch(err => {
        res.status(500).send(err);
    });
};

exports.deleteProject = function (req, res) {
    tableModel.removeProject(req.params.id).then(dbRes => {
        res.jsonp(dbRes);
    }).catch(err => {
        res.status(500).send(err);
    });
};

exports.updateProjectById = function (req, res) {
    let project = new tableModel.Project(req.body);
    tableModel.updateProjectById(req.params.id, project).then(dbRes => {
        res.jsonp(dbRes);
    }).catch(err => {
        res.status(500).send(err);
    });
};

exports.getProjectById = function (req, res) {
    tableModel.getProjectById(req.params.id).then(dbRes => {
        res.jsonp(dbRes);
    }).catch(err => {
        res.status(500).send(err);
    });
};