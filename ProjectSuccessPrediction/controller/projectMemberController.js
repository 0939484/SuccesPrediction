'use strict';

const projectMemberModel = require('../model/projectMember');

exports.addProjectMember = function (req, res) {
    const projectMember = new projectMemberModel.ProjectMember(req.body);
    projectMemberModel.addProjectMemberIfNotExists(projectMember).then(dbRes => {
        res.jsonp(dbRes);
    }).catch(err => {
        res.status(500).send(err);
    });
};

exports.addProjectMemberByEmail = function (req, res) {
    const projectMember = new projectMemberModel.ProjectMember(req.body);
    projectMemberModel.addProjectMemberByEmail(projectMember, req.body.emailAddress).then(dbRes => {
        res.jsonp(dbRes);
    }).catch(err => {
        res.status(500).send(err);
    });
};

exports.getAllProjectMembers = function (req, res) {
    projectMemberModel.getAllProjectMembers().then(dbRes => {
        res.jsonp(dbRes);
    }).catch(err => {
        res.status(500).send(err);
    });
};

exports.getAllMembersFromProject = function (req, res) {
    projectMemberModel.getAllMembersFromProject(req.params.projectId).then(dbRes => {
        res.jsonp(dbRes);
    }).catch(err => {
        res.status(500).send(err);
    });
};

exports.getAllProjectsWithMember = function (req, res) {
    projectMemberModel.getAllProjectsWithMember(req.params.memberId).then(dbRes => {
        res.jsonp(dbRes);
    }).catch(err => {
        res.status(500).send(err);
    });
};

exports.getNumOfPeopleAnswered = function (req, res) {
    projectMemberModel.getNumOfPeopleAnswered(req.params.projectId).then(dbRes => {
        res.jsonp(dbRes);
    }).catch(err => {
        res.status(500).send(err);
    });
};

exports.getProjectMemberById = function (req, res) {
    projectMemberModel.getProjectMemberById(req.params.id).then(dbRes => {
        res.jsonp(dbRes);
    }).catch(err => {
        res.status(500).send(err);
    });
};

exports.updateProjectMemberById = function (req, res) {
    const projectMember = new projectMemberModel.ProjectMember(req.body);
    projectMemberModel.updateProjectMemberById(req.params.id, projectMember).then(dbRes => {
        res.jsonp(dbRes);
    }).catch(err => {
        res.status(500).send(err);
    });
};

exports.removeProjectMember = function (req, res) {
    projectMemberModel.removeProjectMember(req.params.projectId, req.params.id).then(dbRes => {
        res.jsonp(dbRes);
    }).catch(err => {
        res.status(500).send(err);
    });
};