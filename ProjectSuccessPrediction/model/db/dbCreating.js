'use strict';

exports.initDb = function () {
    const db = require('./dbConnection').connection;

    return new Promise((resolve => {
        db.query("DROP TABLE IF EXISTS Project");
        db.query("DROP TABLE IF EXISTS Project_Member");
        db.query("DROP TABLE IF EXISTS Member");
        db.query("DROP TABLE IF EXISTS Project_Answers");
        db.query("DROP TABLE IF EXISTS Answers");
        db.query("DROP TABLE IF EXISTS Question");


        db.query("CREATE TABLE IF NOT EXISTS Project (" +
            "ID int(11) NOT NULL AUTO_INCREMENT," +
            "Name varchar(100)," +
            "Startdate date," +
            "Location varchar(100)," +
            "Country varchar(100)," +
            "Sector varchar(100)," +
            "TypeProject varchar(100)," +
            "TypeInovation varchar(100)," +
            "NumberPeople numeric(19,0)," +
            "PRIMARY KEY (ID))", function (err, res) {
                if (err)
                    throw err;
                console.log("Project Table created");
            }
        );

        db.query("CREATE TABLE IF NOT EXISTS Project_Member(\n" +
            "ID int(11) NOT NULL AUTO_INCREMENT,\n" +
            "ProjectID int(11) NOT NULL,\n" +
            "MemberID int(11) NOT NULL,\n" +
            "PRIMARY KEY (ID)\n" +
            ")", function (err, res) {
            if (err)
                throw err;
            console.log("Project_Member Table created");
        });

        db.query("CREATE TABLE IF NOT EXISTS Member(\n" +
            "ID int NOT NULL AUTO_INCREMENT,\n" +
            "Firstname varchar(100),\n" +
            "Middlename varchar(100),\n" +
            "Lastname varchar(100),\n" +
            "Emailaddress varchar(100),\n" +
            "Role varchar(100),\n" +
            "PRIMARY KEY (ID))", function (err, res) {
            if (err)
                throw err;
            console.log("Member Table created");
        });

        db.query("CREATE TABLE IF NOT EXISTS Project_Answers(\n" +
            "ID int(11) NOT NULL AUTO_INCREMENT,\n" +
            "ProjectID int(11),\n" +
            "AnswersID int(11),\n" +
            "MemberID int(11),\n" +
            "SetNumber integer(255),\n" +
            "PRIMARY KEY (ID)\n" +
            ")", function (err, res) {
            if (err)
                throw err;
            console.log("Project_Answer Table created");
        });

        db.query("CREATE TABLE IF NOT EXISTS Answers(\n" +
            "ID int NOT NULL AUTO_INCREMENT,\n" +
            "Answer int(11),\n" +
            "QuestionID int(11),\n" +
            "PRIMARY KEY (ID) \n" +
            ")", function (err, res) {
            if (err)
                throw err;
            console.log("Answers Table created");
        });

        db.query("CREATE TABLE IF NOT EXISTS Question(\n" +
            "ID int NOT NULL AUTO_INCREMENT,\n" +
            "Question varchar(256),\n" +
            "PRIMARY KEY (ID) \n" +
            ")", function (err, res) {
            if (err)
                throw err;
            console.log("Question Table created");
            resolve();
        });
    }));
    //only for developing purpose
};