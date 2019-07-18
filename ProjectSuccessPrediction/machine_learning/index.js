const {PythonShell} = require('python-shell');
let pyshell;
let mCallback;

exports.init = function () {
    var options = {
        mode: 'text',
        pythonOptions: ['-u'],
        args: ['message']
    };
    pyshell = new PythonShell("machine_learning/machine_learning.py", options);


    pyshell.on('message', function (message) {
        if (mCallback) {
            mCallback(message);
        }
        // console.log("hello from python");
    });
};

exports.predict = function (complexity, impact, callback) {

    mCallback = callback;
    pyshell.send(`${complexity} ${impact}`);
};