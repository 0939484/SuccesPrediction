const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'smakulawork@gmail.com',
        pass: 'workMailPassword'
    }
});

exports.sendMessageToMails = function (mailArray, text) {
    console.log(mailArray);
    return new Promise((resolve, reject) => {
        transporter.sendMail(constructMailOptions(mailArray, text), function (error, info) {
            if (error) {
                console.log(error);
                reject(error);
            } else {
                console.log('Email sent: ' + info.response);
                resolve();
            }
        });
    });
};

function constructMailOptions(mailsArray, text) {
    return {
        from: 'smakulawork@gmail.com',
        to: constructMailList(mailsArray),
        subject: 'Project Success Prediction',
        text: text,
    };
}

function constructMailList(mailsArray) {
    let list = "";
    for (let i = 0; i < mailsArray.length; i++) {
        list += mailsArray[i];
        if (i !== mailsArray.length - 1) list += ", ";
    }
    return list;
}