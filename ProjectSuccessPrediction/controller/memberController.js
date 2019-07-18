'use strict';

const memberModel = require('../model/member');

exports.addMember = function (req, res) {
    const member = new memberModel.Member(req.body);
    memberModel.addMember(member).then(dbRes => {
        res.jsonp(dbRes);
    }).catch(err => {
        res.status(500).send(err);
    });
};

exports.getAllMembers = function (req, res) {
    memberModel.getAllMembers().then(dbRes => {
        res.jsonp(dbRes);
    }).catch(err => {
        res.status(500).send(err);
    });
};

exports.getMemberById = function (req, res) {
    memberModel.getMemberById(req.params.id).then(dbRes => {
        res.jsonp(dbRes);
    }).catch(err => {
        res.status(500).send(err);
    });
};

exports.updateMemberById = function (req, res) {
    const member = new memberModel.Member(req.body);
    memberModel.updateMemberById(req.params.id, member).then(dbRes => {
        res.jsonp(dbRes);
    }).catch(err => {
        res.status(500).send(err);
    });
};

exports.removeMember = function (req, res) {
    memberModel.removeMember(req.params.id).then(dbRes => {
        res.jsonp(dbRes);
    }).catch(err => {
        res.status(500).send(err);
    });
};