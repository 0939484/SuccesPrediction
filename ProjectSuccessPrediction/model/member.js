'use strict';

const dbModel = require('./db/db');
const db = new dbModel.Database();

class Member {
    constructor(member) {
        this.id = member.id;
        this.firstName = member.firstName;
        this.middleName = member.middleName;
        this.lastName = member.lastName;
        this.emailAddress = member.emailAddress;
        this.role = member.role;
    }
}

Member.constructMemberFromDb = function (dbEntity) {
    return new Member({
        id: dbEntity.ID,
        firstName: dbEntity.Firstname,
        middleName: dbEntity.Middlename,
        lastName: dbEntity.Lastname,
        emailAddress: dbEntity.Emailaddress,
        role: dbEntity.Role,
    });
};

Member.dbEntitiesToMembers = function (dbEntities) {
    let members = [];
    dbEntities.forEach(dbEntity => {
        members.push(Member.constructMemberFromDb(dbEntity));
    });
    return members;
};

exports.Member = Member;

exports.addMember = function (member) {
    return checkForRoleExisting(member.role).then(roleExists => {
        return exports.getMemberByEmail(member.emailAddress);
    }).then(dbMember => {
        if (dbMember) throw memberWithEmailExistsException;
        return addMemberToDb(member).then(res => {
            return {id: res.insertId};
        });
    });
};

function checkForRoleExisting(role) {
    return new Promise((resolve, reject) => {
        const {roles} = require('../configure');
        if (!roles.includes(role))
            return reject(noRoleException);
        resolve(true);
    });
}

function addMemberToDb(member) {
    return db.query("INSERT INTO Member (Firstname, Middlename, Lastname, Emailaddress, Role) VALUES (?,?,?,?,?)",
        [member.firstName, member.middleName, member.lastName, member.emailAddress, member.role]);
}

exports.getMemberByEmail = function (email) {
    return getDbMemberByEmail(email).then(dbMember => {
        if (dbMember.length === 0) return null;
        return Member.constructMemberFromDb(dbMember[0]);
    });
};

function getDbMemberByEmail(email) {
    return db.query("SELECT * FROM Member WHERE Emailaddress = ?", [email]);
}

exports.getMembersByName = function (name) {
    return getDbMemberByName(name).then(dbMembers => {
        return Member.dbEntitiesToMembers(dbMembers);
    });
};

function getDbMemberByName(name) {
    return db.query("SELECT * FROM Member WHERE Firstname = ?", [name]);
}

exports.getAllMembers = function () {
    return getAllDbMembers().then(dbMembers => {
        return Member.dbEntitiesToMembers(dbMembers);
    })
};

function getAllDbMembers() {
    return db.query("SELECT * FROM Member", []);
}

exports.getMemberById = function (id) {
    return getDbMemberById(id).then(dbMember => {
        return Member.constructMemberFromDb(dbMember[0]);
    })
};

function getDbMemberById(id) {
    return db.query("SELECT * FROM Member WHERE ID = ?", [id]);
}

exports.getMembersInIdRange = function (idArray) {
    return getMembersInIdRangeFromDb(idArray).then(res => {
        return Member.dbEntitiesToMembers(res);
    });
};

function getMembersInIdRangeFromDb(idArray) {
    return db.query("SELECT * FROM Member WHERE ID IN (?) ", [idArray]);
}

exports.updateMemberById = function (id, member) {
    return updateDbMemberById(id, member).then(res => {
        return {
            affectedRows: res.affectedRows,
            changedRows: res.changedRows,
        };
    });
};

function updateDbMemberById(id, member) {
    return db.query("UPDATE Member SET Firstname = ?, Middlename = ?, Lastname = ?, Emailaddress = ?, Role = ? WHERE ID = ?",
        [member.firstName, member.middleName, member.lastName, member.emailAddress, member.role, id]);
}

exports.removeMember = function (id) {
    return removeMemberFromDb(id).then(res => {
        return {affectedRows: res.affectedRows};
    });
};

function removeMemberFromDb(id) {
    return db.query("DELETE FROM Member WHERE ID = ?", [id]);
}

const memberWithEmailExistsException = {
    name: 'MemberWithEmailExistsException',
    message: "Member with email already exists",
};

const noAuthorizeException = {
    name: 'NoAuthorizeException',
    message: 'Wrong Email or First Name',
};

const noRoleException = {
    name: 'NoRoleException',
    message: 'There is no role like that',
};