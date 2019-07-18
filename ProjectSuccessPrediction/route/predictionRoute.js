const express = require('express');
const router = express.Router();
const predictionController = require("../controller/predictionController");

router.get('/', function (req, res) {
    predictionController.getPrediction(req, res);
});

router.get('/:projectId/:setNumber', function (req, res) {
    predictionController.getPojectPrediction(req, res);
});

router.get('/:projectId', function (req, res) {
    predictionController.getLastPojectPrediction(req, res);
}); 


module.exports = router;