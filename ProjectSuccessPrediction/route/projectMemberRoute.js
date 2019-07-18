const express = require('express');
const router = express.Router();

const projectMemberController = require('../controller/projectMemberController');

router.post('/member', function (req, res) {
    projectMemberController.addProjectMember(req, res);
});

router.post('/member/email', function (req, res) {
    projectMemberController.addProjectMemberByEmail(req, res);
});

router.get('/member', function (req, res) {
    projectMemberController.getAllProjectMembers(req, res);
});

router.get('/:projectId/member', function (req, res) {
    projectMemberController.getAllMembersFromProject(req, res);
});

router.get('/member/:memberId', function (req, res) {
    projectMemberController.getAllProjectsWithMember(req, res);
});

router.get('/:projectId/question/peopleAnswered', function (req, res) {
    projectMemberController.getNumOfPeopleAnswered(req, res);
});

// router.get('/member/:id', function (req, res) {
//     console.log("here2");
//     projectMemberController.getProjectMemberById(req, res);
// });

router.put('/member/:id', function (req, res) {
    projectMemberController.updateProjectMemberById(req, res);
});

router.delete('/:projectId/member/:id', function (req, res) {
    projectMemberController.removeProjectMember(req, res);
});

module.exports = router;