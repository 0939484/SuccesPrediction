const express = require('express');
const router = express.Router();

const memberController = require('../controller/memberController');

router.post('/', function (req, res) {
    memberController.addMember(req, res);
});

router.get('/', function (req, res) {
    memberController.getAllMembers(req, res);
});

router.get('/:id', function (req, res) {
    memberController.getMemberById(req, res);
});

router.put('/:id', function (req, res) {
    memberController.updateMemberById(req, res);
});

router.delete('/:id', function (req, res) {
    memberController.removeMember(req, res);
});

module.exports = router;