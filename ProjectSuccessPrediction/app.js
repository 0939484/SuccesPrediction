'use strict';

const express = require('express'),
    logger = require('morgan'),
    bodyParser = require('body-parser'),
    urlencodedParser = bodyParser.urlencoded({extended: true}),
    jsonParser = bodyParser.json();

const cors = require('cors');

const app = express();
app.set('view engine', 'ejs');


const dbCreating = require('./model/db/dbCreating');
const dbFileInsertion = require('./model/db/dbInsertionFromFile');
const mlIndex = require("./machine_learning/index");

initializeServer();

async function initializeServer() {
    // await dbCreating.initDb();
    // await dbFileInsertion('./public/Table.xlsx');
    mlIndex.init();
}

// TODO new file for the views addressing ?
app.use(express.static(__dirname + '/public'));

app.get('/', function(req, res) {
    res.render('pages/logIn');
});

app.get('/views/dashboard', function(req, res) {
    res.render('pages/dashboard');
});

app.get('/views/login', function(req, res) {
    res.render('pages/logIn');
});

app.get('/views/signup', function(req, res) {
    res.render('pages/signUp');
});

app.get('/views/projects', function(req, res) {
    res.render('pages/myProjects');
});

app.get('/views/update', function(req, res) {
    res.render('pages/updateProject');
});

app.get('/views/new', function(req, res) {
    res.render('pages/addProject');
});

app.get('/views/result', function(req, res) {
    res.render('pages/result');
});

app.get('/views/answerQuestions', function(req, res) {
    res.render('pages/answerQuestions');
});

app.get('/views/questionaire', function(req, res) {
    res.render('pages/questionaire');
});

app.get('/views/questions', function(req, res) {
    res.render('pages/questionManager');
});

app.get('/views/members', function(req, res) {
    res.render('pages/members');
});

const passport = require('passport');
app.use(passport.initialize());
app.use(passport.session());

app.use(logger('dev'));

app.use(urlencodedParser);
app.use(jsonParser);
app.use(cors());

const routes = require('./route/index');
//add routes to the server
routes(app);

module.exports = app;
