const express = require('express');
const router = express.Router();
const tableController = require("../controller/tableController");

router.get('/', function (req, res) {
    tableController.getTable(req, res);
});

router.get('/historical', function (req, res) {
    tableController.getHistoricalProjects(req, res);
});

router.post('/', function (req, res) {
    tableController.addProject(req, res);
});

router.get('/:id', function (req, res) {
    tableController.getProjectById(req, res);
});

router.put('/:id', function (req, res) {
    tableController.updateProjectById(req, res);
});

router.delete('/:id', function (req, res) {
    tableController.deleteProject(req, res);
});

module.exports = router;