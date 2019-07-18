'use strict';

module.exports = function (app) {
    const tableRoute = require('./tableRoute'),
        memberRoute = require('./memberRoute'),
        projectMemberRoute = require('./projectMemberRoute'),
        answerRoute = require('./answerRoute'),
        projectAnswerRoute = require('./projectAnswerRoute'),
        questionRoute = require('./questionRoute'),
        authentificationRoute = require('./authentificationRoute'),
        predictionRoute = require("./predictionRoute");

    app.use('/table', tableRoute);
    app.use('/member', memberRoute);
    app.use('/project', projectMemberRoute);
    app.use('/answer', answerRoute);
    app.use('/project', projectAnswerRoute);
    app.use('/question', questionRoute);
    app.use('/predict', predictionRoute);
    app.use('', authentificationRoute);
};
